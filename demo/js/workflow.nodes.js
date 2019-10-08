function StepNode() {
  this.addInput("1", "number");
  this.addInput("2", "number");
  this.addOutput("chunk", "number");
  this.properties = { };
  this.addProperty("classes", "", "string");
//      var that = this;
  this.slider = this.addWidget("slider", "Slider", 0.5, function (v) { }, { min: 0, max: 1 });
  this.number = this.addWidget("number", "Number", 0.5, function (v) { }, { min: 0, max: 100 });
  this.combo = this.addWidget("combo", "Combo", "red", function (v) { }, { values: ["red", "green", "blue"] });
  this.text = this.addWidget("text", "Text", "edit me", function (v) { }, {});
  this.toggle = this.addWidget("toggle", "Toggle", true, function (v) { }, { on: "enabled", off: "disabled" });
  this.button = this.addWidget("button", "Button", null, function (v) { }, {});
  this.size = this.computeSize();
  this.serialize_widgets = true;
}

StepNode.title = "Step";
StepNode.prototype.onGetInputs = function() {
    return [
        ["chunk", "chunk"],
    ];
};

LiteGraph.registerNodeType("workflow/step", StepNode);

function AddClipNode() {
  this.addOutput("chunk", "chunk");
  this.properties = { };
  this.addProperty("classes", "", "string");
  this.addProperty("noOfFrames", "", "number");
  this.size = this.computeSize();
  this.serialize_widgets = true;
}

AddClipNode.title = "AddClip";
LiteGraph.registerNodeType("workflow/addclip", AddClipNode);

function ExportClipNode() {
  this.addInput("in", "chunk");
  this.properties = { };
  this.exporter = this.addWidget("text", "Exporter", "", function (v) { }, {});
  this.path = this.addWidget("text", "Path", "", function (v) { }, {});
  this.size = this.computeSize();
  this.serialize_widgets = true;
}

ExportClipNode.title = "ExportClip";
LiteGraph.registerNodeType("workflow/exportclip", ExportClipNode);

function SplitByClassesNode() {
  this.addInput("in", "chunk");
  this.addOutput("chunk 1", "chunk");
  this.addOutput("chunk 2", "chunk");
  this.properties = { };
  this.addProperty("classes", "", "string");
  this.config = this.addWidget("text", "Config", "", 
    function (v, that, node, pos, event, widget) { 
      console.log(v, that, pos, event);
      try {
        var config = JSON.parse(v);
        if( config ) {
          var i = 0;
          while( Object.keys(config) > node.outputs.length ) {
            node.addOutput("foo", "chunk");
          }
          for( const key of Object.keys(config) ) {
            node.outputs[i++].name = key;
          }
        } 
        widget.error = undefined;
      } catch(e) {
        widget.error = e;
        console.log("error after edit "+e);
      }
    }, 
    { big: true, json: true });
  this.size = this.computeSize();
  this.serialize_widgets = true;
}

SplitByClassesNode.title = "Split by Classes";
SplitByClassesNode.prototype.onGetOutputs = function() {
  const nextOutput = `chunk ${this.outputs.length+1}`;
    return [
        [nextOutput, "chunk"],
    ];
};

// getMenuOptions( node ) could be overridden
// getExtraMenuOptions dto, but only append options

LiteGraph.registerNodeType("workflow/splitbyclasses", SplitByClassesNode);

function SplitByMaxFrame() {
  this.addInput("in", "chunk");
  this.addOutput("split chunks", "chunk");
  this.properties = { };
  this.slider = this.addWidget("slider", "MaxFrame", 2, function () {},
   { min: 1, max: 300, formatter: (w) => "max "+Number(w.value).toFixed(0)+" frames" });
  this.size = this.computeSize();
  this.serialize_widgets = true;
}

SplitByMaxFrame.title = "Split By MaxFrame";

LiteGraph.registerNodeType("workflow/splitbymaxframe", SplitByMaxFrame);

function SplitForInterpolate() {
  this.addInput("in", "chunk");
  this.addOutput("keyframe chunks", "chunk");
  this.properties = { };
  this.slider = this.addWidget("slider", "EveryFrame", 2, function () {}, 
    { prec: 0, min: 2, max: 20, formatter: (w) => "every "+ Number(w.value).toFixed(0) + "th frame" });
  this.size = this.computeSize();
  this.serialize_widgets = true;
}

SplitForInterpolate.title = "Split For Interpolate";

LiteGraph.registerNodeType("workflow/SplitForInterpolate", SplitForInterpolate);

function ReviewWithSample() {
  this.addInput("in", "chunk");
  this.addOutput("review sample chunks", "chunk");
  this.properties = { };
  this.slider = this.addWidget("slider", "Precentage", 2, function () {}, 
    { prec: 0, min: 2, max: 50, formatter: (w) => {
      return Number(w.value).toFixed(0) + " %";
    } });
  this.size = this.computeSize();
  this.serialize_widgets = true;
}

ReviewWithSample.title = "Sample for Review";

LiteGraph.registerNodeType("workflow/ReviewWithSample", ReviewWithSample);

function MergeNode() {
  this.addInput("chunk 1", "chunk");
  this.addOutput("chunks", "chunk");
  this.properties = { };
  this.size = this.computeSize();
  this.serialize_widgets = true;
}
MergeNode.prototype.onGetInputs = function() {
  const nextInput = `chunk ${this.inputs.length+1}`;
    return [
        [nextInput, "chunk"],
    ];
};

MergeNode.title = "Merge";

LiteGraph.registerNodeType("workflow/MergeNode", MergeNode);

function ToolNode() {
  this.addInput("in", "chunk");
  this.addOutput("chunk", "chunk");
  this.properties = { };
  //this.addProperty("toolconfig", [1,2,3], "object");
  this.text = this.addWidget("text", "Capabilities", "", function (v) { }, {});
  this.text = this.addWidget("text", "Config", "", function (v) { }, {});
  //this.addProperty("OP", "+", "enum", { values: ["+","-","*","/"] });

  this.size = this.computeSize();
  this.serialize_widgets = true;
}

ToolNode.title = "Tool";

LiteGraph.registerNodeType("workflow/ToolNode", ToolNode);

