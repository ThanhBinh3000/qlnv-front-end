/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function nodeUpdate(data) {
  console.log("this.someProp");
}
function onLoadNodeData(data) {
  console.log("this.someProp");
}
function onLoadNodeToNode(data) {
  console.log("this.someProp");
}
function onAddNodeToNode(data) {
  console.log("this.someProp");
}

drawFlow = function (id) {
  color_processing = "rgb(113,153,236)";
  color_finish = "rgb(230,193,119)";
  color_border = "rgb(200,163,89)";
  color_anchor = "rgb(200,163,89)";
  color_active = "rgb(255,100,100)";
  fixedWidth = 0;
  fixedHeight = 0;
  firstSelectNode = null;
  endSelectNode = null;
  select = 0;
  buttonType = null;

  nodeList = new Array();
  nodeToNodeList = new Array();
  nodeLength = 0;
  nodeToNodeLength = 0;
  nodeHeight = 40;
  nodeWidth = 100;
  nodeRadius = 20;
  activeNode = -1;
  activeLine = -1;
  hintNode = -1;
  xpoint = 0;
  ypoint = 0;
  mouseFlags = 0;
  maxId = 0;

  isChangeGraph = false;

  this.id = id;
  this.flowId = 0;

  // this.activeNode = activeNode;
  // this.activeLine = activeLine;

  this.getActiveNode = function(){
    if(activeNode > -1){
      return nodeList[activeNode]
    }
    return null;
  }

  this.getactiveLine = function(){
    if(activeLine > -1){
      var previousId = nodeList[nodeToNodeList[activeLine].previousId].nodeId;
      var nextId = nodeList[nodeToNodeList[activeLine].nextId].nodeId;
        return {
          previousId,
          nextId ,
        }
    }
    return null;
  }

  this.setFlowData = function (flow) {
      this.flowId = flow.flowId;
      nodeList = new Array();
      nodeToNodeList = new Array();
      nodeLength = 0;
      nodeToNodeLength = 0;

      if (flow.lstNodes != null && flow.lstNodes.length > 0) {
          for (var i = 0; i < flow.lstNodes.length; i++) {
              var item = flow.lstNodes[i];
              this.addNode(item.nodeId, item.nodeName, item.left, item.top,
                      item.right, item.bottom, item.status, item.type);
          }
      }
      if (flow.lstNodeToNodes != null && flow.lstNodeToNodes.length > 0) {
          for (var i = 0; i < flow.lstNodeToNodes.length; i++) {
              var item = flow.lstNodeToNodes[i];
              this.addRelation(item.previousId, item.nextId, item.action,
                      item.type, item.specialActionLabel,item.id);
          }
      }
      this.drawGraph();

  }

  this.getNodeList = function () {
      return nodeList;
  };

  this.changeAccessory = function () {
      if (select == 0) {
          select = 1;
      } else {
          select = 0;
      }
  }

  this.setSelect = function (selectStatus) {
      select = selectStatus;
  };

  this.setButtonType = function (type) {
      buttonType = type;
  };

  getNextIdOfNode = function () {
      maxId = maxId + 1;
      return maxId;
  };

  this.updateNodeId = function (index, nodeId) {
      for (var i = 0; i < nodeLength; i++) {
          if (nodeList[i].id == index) {
              nodeList[i].nodeId = nodeId;
              // console.log("after update");
              break;
          }
      }
  }

  this.addRelation = function (previousId, nextId, action, type, specialActionLabel,id) {
      var previousIndex = -1;
      var nextIndex = -1;
      // Tim index cua nodeId
      for (var i = 0; i < nodeList.length; i++) {
          if (nodeList[i].nodeId == previousId) {
              previousIndex = i;
          }
          if (nodeList[i].nodeId == nextId) {
              nextIndex = i;
          }
      }
      var add = true;
      // Neu da ve relation roi thi thoi
      for (var i = 0; i < nodeToNodeList.length; i++) {
          if (nodeToNodeList[i].previousId == previousIndex
                  && nodeToNodeList[i].nextId == nextIndex) {
              add = false;
              break;
          }
      }
      if (add) {
          var nodeToNode = new Object();
          nodeToNode.id = id;
          nodeToNode.previousId = previousIndex;
          nodeToNode.nextId = nextIndex;
          nodeToNode.action = action;
          nodeToNode.type = type;
          nodeToNode.specialActionLabel = specialActionLabel;
          nodeToNodeList[nodeToNodeLength] = nodeToNode;
          nodeToNodeLength++;
          // console.log("pre=" + previousIndex + ";next=" + nextIndex);
      }
      this.drawGraph();
  };

  this.addNode = function (nodeId, nodeName, left, top, right, bottom, status,
          type, color) {
      var node = new Object();
      node.id = getNextIdOfNode();
      node.nodeName = nodeName;
      node.status = status;
      node.nodeId = nodeId;
      node.type = type;

      node.left = left;
      node.top = top;
      node.right = right;
      node.bottom = bottom;
      if (color != null) {
          node.color = color;
      } else {
          node.color = color_processing;
      }
      nodeList[nodeLength] = node;
      nodeLength = nodeLength + 1;
      // console.log("nodeId=" + node.nodeId);
      this.drawGraph();
  };

  this.addNewNode = function (nodeName, type) {
      //var wgt = zk.Widget.$("$flowConfigDlg");
      var previousNode = null;
      if (activeNode >= 0) {
          previousNode = nodeList[activeNode];
      }
      var data = {
          'previousNode': previousNode,
          'typeNode': type
      };
      //zAu.send(new zk.Event(wgt, 'onAddNewNode', JSON.stringify(data)));
//		var node = new Object();
//		node.id = getNextIdOfNode();
//		node.nodeId = null;
//		if (nodeName != null && nodeName != "")
//			node.nodeName = nodeName;
//		else
//			node.nodeName = "Node " + node.id;
//		node.status = status;
//		node.color = color_processing;
//		if (type === undefined) {
//			type = 1;
//		}
//		node.type = type;
//		node.status = 1;
//		// node.previousId = nodeLength-1;
//		if (nodeLength == 0) {
//			node.left = 10;
//			node.top = 10;
//			if (type == 1) {
//				node.right = node.left + nodeWidth;
//				node.bottom = node.top + nodeHeight;
//			} else {
//				node.right = node.left + 2 * nodeRadius;
//				node.bottom = node.top + 2 * nodeRadius;
//			}
//			nodeList[nodeLength] = node;
//		} else {
//			node.left = nodeList[nodeLength - 1].right + 50;
//			node.top = nodeList[nodeLength - 1].top;
//
//			if (node.left > fixedWidth) {
//				if (node.top < fixedHeight) {
//					node.left = nodeList[nodeLength - 1].left;
//					node.top = node.top + 80;
//				} else {
//					node.left = Math.random() % fixedWidth;
//				}
//			}
//			if (node.top > fixedHeight) {
//				node.top = Math.random() % fixedHeight;
//				node.left = Math.random() % fixedWidth;
//			}
//			if (type == 1) {
//				node.right = node.left + nodeWidth;
//				node.bottom = node.top + nodeHeight;
//			} else {
//				node.right = node.left + 2 * nodeRadius;
//				node.bottom = node.top + 2 * nodeRadius;
//			}
//			console.log("nodeLength=" + nodeLength + ";left=" + node.left
//					+ ";top=" + node.top + ";right=" + node.right + ";bottom="
//					+ node.bottom);
//
//			nodeList[nodeLength] = node;
//
//			var nodeToNode = new Object();
//
//			nodeToNode.previousId = nodeList[nodeLength - 1].nodeId;
//			nodeToNode.nextId = nodeList[nodeLength].nodeId;
//			nodeToNode.type = buttonType;
//			if (nodeToNode.type == null) {
//				nodeToNode.type = 1;
//			}
//
//			nodeToNode.previousId = nodeLength - 1;
//			nodeToNode.nextId = nodeLength;
//			nodeToNodeList[nodeToNodeLength] = nodeToNode;
//			nodeToNodeLength += 1;
//		}
//		nodeLength += 1;
//		this.drawGraph();
  };

  this.addGraph = function (levelW, levelH, customInfo) {

      this.addNode(nodeLength, customInfo.nodeName,
              levelW * (nodeWidth + 20), levelH * (nodeHeight + 20),
              color_processing, (nodeLength == 0 ? null : (nodeLength - 1)));

      var tmp = customInfo.childs.length;
      for (var i = 0; i < tmp; i++) {
          this.addGraph(levelW + 1, levelH + i, customInfo.childs[i]);
      }
  };

  this.addNextNode = function (nodeId, nodeName) {
      var node = new Object();
      node.id = getNextIdOfNode();
      node.nodeName = nodeName;
      node.nodeId = nodeId;
      node.previousId = nodeLength - 1;
      if (nodeLength == 0) {
          node.left = 10;
          node.top = 10;

      } else {
          node.left = nodeList[nodeLength - 1].right + 50;
          node.top = nodeList[nodeLength - 1].top;
      }
      node.color = color_processing;
      nodeList[nodeLength] = node;
      nodeLength = nodeLength + 1;
      this.drawGraph();
  };

  this.clearNode = function () {
      nodeList = new Array();
      nodeLength = 0;
      this.drawGraph();
  };

  this.deleteNode = function (id) {
      //var wgt = zk.Widget.$("$flowConfigDlg");
      if (activeNode >= 0) {
          //zAu.send(new zk.Event(wgt, 'onDeleteNode', JSON.stringify(nodeList[activeNode])));
      }
//		var index = -1;
//		for (var i = 0; i < nodeLength; i++) {
//			if (nodeList[i].id == id) {
//				nodeList.splice(i, 1);
//				nodeLength--;
//				index = i;
//				break;
//			}
//		}
//		for (var i = nodeToNodeLength - 1; i >= 0; i--) {
//			if (nodeToNodeList[i].nextId == index
//					|| nodeToNodeList[i].previousId == index) {
//				nodeToNodeList.splice(i, 1);
//				nodeToNodeLength--;
//			}
//		}
//		for (var i = nodeToNodeLength - 1; i >= 0; i--) {
//			if (nodeToNodeList[i].nextId > index) {
//				nodeToNodeList[i].nextId = nodeToNodeList[i].nextId - 1;
//			}
//			;
//			if (nodeToNodeList[i].previousId > index) {
//				nodeToNodeList[i].previousId = nodeToNodeList[i].previousId - 1;
//			}
//			;
//		}
//		this.drawGraph();
  };

  this.deleteNodeToNode = function (index, redraw) {
      //var wgt = zk.Widget.$("$flowConfigDlg");
      if (activeLine >= 0) {
          var previousId = nodeList[nodeToNodeList[activeLine].previousId].nodeId;
          var nextId = nodeList[nodeToNodeList[activeLine].nextId].nodeId;
          for (var i = 0; i < page.flow.lstNodeToNodes.length; i++) {
              var ntnSelect = page.flow.lstNodeToNodes[i];
              if (ntnSelect.nextId == nextId
                      && ntnSelect.previousId == previousId) {
                  //zAu.send(new zk.Event(wgt, 'onDeleteNodeToNode', JSON.stringify(ntnSelect)));
                  break;
              }
          }
      }

//		nodeToNodeList.splice(index, 1);
//		nodeToNodeLength--;
//		if (redraw) {
//			this.drawGraph();
//		}
  }

  this.checkIEVersion = function () {
      var bReturn = false;

      var BrowserDetect = {
          init: function () {
              this.browser = this.searchString(this.dataBrowser)
                      || "An unknown browser";
              this.version = this.searchVersion(navigator.userAgent)
                      || this.searchVersion(navigator.appVersion)
                      || "an unknown version";
              this.OS = this.searchString(this.dataOS) || "an unknown OS";
          },
          searchString: function (data) {
              for (var i = 0; i < data.length; i++) {
                  var dataString = data[i].string;
                  var dataProp = data[i].prop;
                  this.versionSearchString = data[i].versionSearch
                          || data[i].identity;
                  if (dataString) {
                      if (dataString.indexOf(data[i].subString) != -1)
                          return data[i].identity;
                  } else if (dataProp)
                      return data[i].identity;
              }
          },
          searchVersion: function (dataString) {
              var index = dataString.indexOf(this.versionSearchString);
              if (index == -1)
                  return;
              return parseFloat(dataString.substring(index
                      + this.versionSearchString.length + 1));
          },
          dataBrowser: [{
                  string: navigator.userAgent,
                  subString: "Chrome",
                  identity: "Chrome"
              }, {
                  string: navigator.userAgent,
                  subString: "OmniWeb",
                  versionSearch: "OmniWeb/",
                  identity: "OmniWeb"
              }, {
                  string: navigator.vendor,
                  subString: "Apple",
                  identity: "Safari",
                  versionSearch: "Version"
              }, {
                  prop: window.opera,
                  identity: "Opera",
                  versionSearch: "Version"
              }, {
                  string: navigator.vendor,
                  subString: "iCab",
                  identity: "iCab"
              }, {
                  string: navigator.vendor,
                  subString: "KDE",
                  identity: "Konqueror"
              }, {
                  string: navigator.userAgent,
                  subString: "Firefox",
                  identity: "Firefox"
              }, {
                  string: navigator.vendor,
                  subString: "Camino",
                  identity: "Camino"
              }, {// for newer Netscapes (6+)
                  string: navigator.userAgent,
                  subString: "Netscape",
                  identity: "Netscape"
              }, {
                  string: navigator.userAgent,
                  subString: "MSIE",
                  identity: "Explorer",
                  versionSearch: "MSIE"
              }, {
                  string: navigator.userAgent,
                  subString: "Gecko",
                  identity: "Mozilla",
                  versionSearch: "rv"
              }, {// for older Netscapes (4-)
                  string: navigator.userAgent,
                  subString: "Mozilla",
                  identity: "Netscape",
                  versionSearch: "Mozilla"
              }],
          dataOS: [{
                  string: navigator.platform,
                  subString: "Win",
                  identity: "Windows"
              }, {
                  string: navigator.platform,
                  subString: "Mac",
                  identity: "Mac"
              }, {
                  string: navigator.userAgent,
                  subString: "iPhone",
                  identity: "iPhone/iPod"
              }, {
                  string: navigator.platform,
                  subString: "Linux",
                  identity: "Linux"
              }]

      };

      BrowserDetect.init();
      if (BrowserDetect.browser == "Firefox") {
          if (BrowserDetect.version > 9) {
              bReturn = true;
          }
      } else if (BrowserDetect.browser == "Chrome") {
          if (BrowserDetect.version > 9) {
              bReturn = true;
          }
      } else if (BrowserDetect.browser == "Explorer") {
          if (BrowserDetect.version > 9) {
              bReturn = true;
          }
      }
      return bReturn;
  };

  this.nodeToJSON = function () {
      var outContent = {
          'flowId': this.flowId,
          'lstNodes': nodeList,
          'lstNodeToNodes': nodeToNodeList
      };
      return outContent;

  }

  this.nodeToJSONOld = function () {
      var outContent = {};
      var flowId = 0;// document.getElementById("viewForm.flowId").value;
      for (var i = 0; i < nodeList.length; i++) {
          if (!outContent["lstNodes[" + i + "].id"]) {
              outContent["lstNodes[" + i + "].id"] = [];
          }
          if (!outContent["lstNodes[" + i + "].flowId"]) {
              outContent["lstNodes[" + i + "].flowId"] = [];
          }
          if (!outContent["lstNodes[" + i + "].nodeId"]) {
              outContent["lstNodes[" + i + "].nodeId"] = [];
          }
          if (!outContent["lstNodes[" + i + "].nodeName"]) {
              outContent["lstNodes[" + i + "].nodeName"] = [];
          }
          if (!outContent["lstNodes[" + i + "].x"]) {
              outContent["lstNodes[" + i + "].x"] = [];
          }

          if (!outContent["lstNodes[" + i + "].y"]) {
              outContent["lstNodes[" + i + "].y"] = [];
          }

          if (!outContent["lstNodes[" + i + "].status"]) {
              outContent["lstNodes[" + i + "].status"] = [];
          }

          outContent["lstNodes[" + i + "].id"].push(nodeList[i].id);
          if (nodeList[i].nodeId) {
              outContent["lstNodes[" + i + "].nodeId"]
                      .push(nodeList[i].nodeId);
          }

          if (flowId) {
              outContent["lstNodes[" + i + "].flowId"].push(flowId);
          }
          outContent["lstNodes[" + i + "].nodeName"]
                  .push(nodeList[i].nodeName);
          if (nodeList[i].x == null) {
              outContent["lstNodes[" + i + "].x"].push(0);
          } else {
              outContent["lstNodes[" + i + "].x"].push(nodeList[i].left);

          }
          if (nodeList[i].y == null) {
              outContent["lstNodes[" + i + "].y"].push(0);
          } else {
              outContent["lstNodes[" + i + "].y"].push(nodeList[i].top);
          }

          if (nodeList[i].status == null) {
              outContent["lstNodes[" + i + "].status"].push(0);
          } else {
              outContent["lstNodes[" + i + "].status"]
                      .push(nodeList[i].status);
          }
      }

      for (var i = 0; i < nodeToNodeList.length; i++) {
          if (!outContent["lstNodeToNodes[" + i + "].previousId"]) {
              outContent["lstNodeToNodes[" + i + "].previousId"] = [];
          }
          if (!outContent["lstNodeToNodes[" + i + "].nextId"]) {
              outContent["lstNodeToNodes[" + i + "].nextId"] = [];
          }
          if (!outContent["lstNodeToNodes[" + i + "].action"]) {
              outContent["lstNodeToNodes[" + i + "].action"] = [];
          }

          outContent["lstNodeToNodes[" + i + "].previousId"]
                  .push(nodeToNodeList[i].previousId);
          outContent["lstNodeToNodes[" + i + "].nextId"]
                  .push(nodeToNodeList[i].nextId);
          outContent["lstNodeToNodes[" + i + "].action"]
                  .push(nodeToNodeList[i].action);
      }
      return outContent;
  };

  this.nodeToNodeToJson = function () {
      var myJSON = JSON.stringify({
          nodeToNodeList: nodeToNodeList
      });
      return myJSON;
  };

  drawRectangle = function (context, text, x, y, height, width, color) {
      context.beginPath();
      context.fillStyle = color;
      context.moveTo(x, y);
      context.lineTo(x + width, y);
      context.lineTo(x + width, y + height);
      context.lineTo(x, y + height);
      context.lineTo(x, y);
      context.fill();
      context.stroke();
      context.closePath();
      context.fillStyle = "#FFF";
      context.fillText(text, x + 10, y + height / 2, width, height);
  };

  drawRect = function (context, node) {
      var radius = 4;
      context.moveTo(node.left + radius, node.top);

      context.lineTo(node.right - radius, node.top);
      context.arc(node.right - radius, node.top + radius, radius,
              3 * Math.PI / 2, 2 * Math.PI);

      context.lineTo(node.right, node.bottom - radius);
      context.arc(node.right - radius, node.bottom - radius, radius, 0,
              Math.PI / 2);

      context.lineTo(node.left + radius, node.bottom);
      context.arc(node.left + radius, node.bottom - radius, radius,
              Math.PI / 2, Math.PI);

      context.lineTo(node.left, node.top + radius);
      context.arc(node.left + radius, node.top + radius, radius, Math.PI,
              3 * Math.PI / 2);
      context.fill();
  };

  drawStart = function (context, node) {
      var radius = nodeRadius;
      context.arc(node.left + radius, node.top + radius, radius, 0,
              2 * Math.PI);
      context.fillStyle = "#BBCCEE";
      context.fill();
  };

  drawEnd = function (context, node) {
      var radius = nodeRadius;
      context.arc(node.left + radius, node.top + radius, radius, 0,
              2 * Math.PI);
      context.fillStyle = "#112233";
      context.fill();
  };

  drawNode = function (context, node) {
      context.beginPath();
      context.fillStyle = node.color;
      if (node.type == 2) {
          drawStart(context, node);
      } else if (node.type == 3) {
          drawEnd(context, node);
      } else {
          drawRect(context, node);
      }
      context.closePath();
      context.fillStyle = "#000";
      context.font = "12px verdana";

      var text = node.nodeName.toString();
      if (text.length > 10) {
          text = text.substring(0, 10) + "..";
      }

      context.fillText(text, node.left + 10, node.top + nodeHeight / 2,
              node.right - node.left);
  };

  drawActiveNode = function (context, node) {
      context.beginPath();
      context.fillStyle = node.color;
      context.fillStyle = "#AABBCC";
      if (node.type == 2) {
          drawStart(context, node);
      } else if (node.type == 3) {
          drawEnd(context, node);
      } else {
          drawRect(context, node);
      }
      context.stroke();
      context.closePath();
      context.fillStyle = "#000";
      context.font = "12px verdana";

      var text = node.nodeName.toString();
      if (text.length > 10) {
          text = text.substring(0, 10) + "..";
      }

      context.fillText(text, node.left + 10, node.top + nodeHeight / 2,
              node.right - node.left);
  };

  drawTooltip = function (context, node) {
      if (node == null || node == undefined) {
          return;
      }

      var remFont = context.font;
      context.font = "13px verdana";
      var text1 = "Node : " + node.nodeName;

      var tm1 = context.measureText(text1);

      var textWidth = tm1.width + 10;
      context.beginPath();
      context.fillStyle = "rgba(255,100,100,0.3)";

      context.moveTo((node.left + node.right) / 2, node.bottom);
      context.lineTo((node.left + node.right) / 2 - 2, node.bottom + 6);
      context.lineTo(node.left, node.bottom + 6);
      context.lineTo(node.left, node.bottom + 6 + 37);
      context.lineTo(node.left + textWidth, node.bottom + 6 + 37);
      context.lineTo(node.left + textWidth, node.bottom + 6);
      context.lineTo((node.left + node.right) / 2 + 2, node.bottom + 6);
      context.lineTo((node.left + node.right) / 2, node.bottom);
      context.fill();

      var remember = context.strokeStyle;
      context.strokeStyle = "rgba(255,100,100,0.3)";
      context.stroke();
      context.strokeStyle = remember;
      context.closePath();

      context.fillStyle = "#000";

      context.fillText(text1, node.left + 5, node.bottom + 20);
      context.font = remFont;
  };

  getCenterpoint = function (x1, y1, x2, y2) {
      var point = new Object();
      if (y1 == y2) {
         // console.log("y1==y2")
          point.x = (x1 + x2) / 2;
         // console.log("after set x");
          point.y = y1 + (Math.sqrt(3) / 2) * (x2 - x1);
         // console.log("after set y");
          point.r = Math.abs(x2 - x1);
         // console.log("after set x,y,r");
          if (x2 > x1) {
             // console.log("x2>x1");
              point.a1 = 4 * Math.PI / 3;
              point.a2 = 5 * Math.PI / 3;
          } else {
             // console.log("x2<x1");
              point.a1 = Math.PI / 3;
              point.a2 = 2 * Math.PI / 3;
          }
      } else if (x1 == x2) {
         // console.log("x1==x2")
          point.y = (y1 + y2) / 2;
          point.x = x1 + (Math.sqrt(3) / 2) * (y2 - y1);
          point.r = Math.abs(y2 - y1);
          if (y2 > y1) {
              point.a1 = 5 * Math.PI / 6;
              point.a2 = point.a1 + Math.PI / 3;
          } else {
              point.a1 = -1 * Math.PI / 6;
              point.a2 = Math.PI / 6;
          }
      } else {
         // console.log("x1 !=x2 && y1 != y2")
          point.r = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));
          var a = Math.atan((y2 - y1) / (x2 - x1));
          point.a1 = 4 / 3 * Math.PI + a;
          point.a2 = 5 / 3 * Math.PI + a;
          if (x1 < x2) {
              point.x = x1 - Math.cos(point.a1) * point.r;
              point.y = y1 - Math.sin(point.a1) * point.r;
          } else {
              point.a1 += Math.PI;
              point.a2 += Math.PI;
              point.x = x1 - Math.cos(point.a1) * point.r;
              point.y = y1 - Math.sin(point.a1) * point.r;
          }
      }
      return point;
  }

  drawAnchor = function (context, fromX, fromY, toX, toY, type) {

      var point = getCenterpoint(fromX, fromY, toX, toY);
      context.beginPath();
      if (type == 2) {
          context.setLineDash([5, 2]);
      } else {
          context.setLineDash([]);
      }
      // context.moveTo(point.x,point.y);
      context.arc(point.x, point.y, point.r, point.a1, point.a2);
      context.stroke();

      context.beginPath();
      var arg = Math.atan((fromY - toY) / (toX - fromX));
      var arg1 = arg - 2 * Math.PI / 6;
      var arg2 = arg;
      var anchorLenght = 10;
      var arrowX1;
      var arrowY1;
      var arrowX2;
      var arrowY2;
      if (toX >= fromX) {
          arrowX1 = toX - Math.cos(arg1) * anchorLenght;
          arrowY1 = toY + Math.sin(arg1) * anchorLenght;
          arrowX2 = toX - Math.cos(arg2) * anchorLenght;
          arrowY2 = toY + Math.sin(arg2) * anchorLenght;
      } else {
          arrowX1 = toX + Math.cos(arg1) * anchorLenght;
          arrowY1 = toY - Math.sin(arg1) * anchorLenght;
          arrowX2 = toX + Math.cos(arg2) * anchorLenght;
          arrowY2 = toY - Math.sin(arg2) * anchorLenght;
      }

      context.moveTo(toX, toY);
      context.lineTo(arrowX1, arrowY1);
      context.moveTo(toX, toY);
      context.lineTo(arrowX2, arrowY2);

      context.closePath();
      context.stroke();
//		if (type == 2) {
//			context.setLineDash([ 0, 0 ]);
//		}



  };

  drawLineAnchor = function (context, fromX, fromY, toX, toY, type) {
      var arg = Math.atan((fromY - toY) / (toX - fromX));

      var arg1 = arg + Math.PI / 6;
      var arg2 = arg - Math.PI / 6;
      var anchorLenght = 10;

      var arrowX1;
      var arrowY1;
      var arrowX2;
      var arrowY2;
      if (toX >= fromX) {
          arrowX1 = toX - Math.cos(arg1) * anchorLenght;
          arrowY1 = toY + Math.sin(arg1) * anchorLenght;
          arrowX2 = toX - Math.cos(arg2) * anchorLenght;
          arrowY2 = toY + Math.sin(arg2) * anchorLenght;
      } else {
          arrowX1 = toX + Math.cos(arg1) * anchorLenght;
          arrowY1 = toY - Math.sin(arg1) * anchorLenght;
          arrowX2 = toX + Math.cos(arg2) * anchorLenght;
          arrowY2 = toY - Math.sin(arg2) * anchorLenght;
      }

      context.beginPath();
      if (type == 2) {
          context.setLineDash([5, 2]);
      }
      context.moveTo(fromX, fromY);
      context.lineTo(toX, toY);
      context.lineTo(arrowX1, arrowY1);
      context.moveTo(toX, toY);
      context.lineTo(arrowX2, arrowY2);
      context.stroke();
      if (type == 2) {
          context.setLineDash([0, 0]);
      }

      context.closePath();
  };

  getLinePoints = function (node1, node2) {
      if(!node1 || !node2){
        var line = {
          x1: 0,
          x2: 0,
          y1: 0,
          y2: 0
      };
        return line;
      }
      var x1 = node1.right;
      var y1 = (node1.top + node1.bottom) / 2;
      var x2 = node2.left;
      var y2 = (node2.top + node2.bottom) / 2;

      if (node1.right < node2.left) {
          x1 = node1.right;
          x2 = node2.left;
      } else if (node1.left >= node2.right) {
          x1 = node1.left;
          x2 = node2.right;
      } else if (node1.bottom < node2.top) {
          x1 = (node1.left + node1.right) / 2;
          y1 = node1.bottom;
          x2 = (node2.left + node2.right) / 2;
          y2 = node2.top;
      } else if (node1.top > node2.bottom) {
          x1 = (node1.left + node1.right) / 2;
          y1 = node1.top;
          x2 = (node2.left + node2.right) / 2;
          y2 = node2.bottom;
      }
      var line = {
          x1: x1,
          x2: x2,
          y1: y1,
          y2: y2
      };
      return line;
  };

  drawNodeToNode = function (context, node1, node2, action, type, isActive) {
      var line = getLinePoints(node1, node2);
      if (isActive) {
          context.lineWidth = 2;
          context.strokeStyle = "rgb(0,0,255)";
          drawAnchor(context, line.x1, line.y1, line.x2, line.y2, type);
          context.strokeStyle = "rgb(0,0,0)";
          context.lineWidth = 1;
      } else {
          drawAnchor(context, line.x1, line.y1, line.x2, line.y2, type);
      }

      if (action != null && action != "") {
          var x = (line.x1 + line.x2) / 2;
          var y = (line.y1 + line.y2) / 2;
          var r = Math.sqrt((line.x1 - line.x2) * (line.x1 - line.x2)
                  + (line.y1 - line.y2) * (line.y1 - line.y2));
          var space = (1 - Math.sqrt(3) / 2) * r;
          if (line.x1 < line.x2) {
              y -= space;
          } else {
              y += space;
          }

          if (line.y1 < line.y2) {
              x += space;
          } else {
              x -= space;
          }
          var textLength = context.measureText(action).width;
          context.fillText(action, x - textLength / 2, y);
      }
  };

  adjustNodePosition = function () {
      var x = 10;
      var y = 10;
  };

  this.resize = function (width, height) {
      fixedWidth = width;
      fixedHeight = height;
      this.drawGraph();
  };

  this.drawGraph = function () {
      try {
          var canvas = document.getElementById(id);
          var updateSizeOfCanvas = false;
          for (var i = 0; i < nodeLength; i++) {
              if (nodeList[i].right > fixedWidth) {
                  fixedWidth = nodeList[i].right;
                  updateSizeOfCanvas = true;
              }
              if (nodeList[i].bottom > fixedHeight) {
                  fixedHeight = nodeList[i].bottom;
                  updateSizeOfCanvas = true;
              }
          }

          if (updateSizeOfCanvas) {
              canvas.style.width = fixedWidth + "px";
              canvas.style.height = fixedHeight + "px";
          }

          canvas.width = fixedWidth;
          canvas.height = fixedHeight;

          var context = canvas.getContext("2d");
          context.font = "bold 12pt Arial";

          if (nodeLength > 0) {
              for (var i = 0; i < nodeLength; i++) {
                  if (i == activeNode) {
                      drawActiveNode(context, nodeList[i]);
                  } else {
                      drawNode(context, nodeList[i]);
                  }
              }

              for (var i = 0; i < nodeToNodeLength; i++) {
                  var isActive = false;
                  if (i == activeLine) {
                      isActive = true;
                  }
                  try {
                      drawNodeToNode(context,
                              nodeList[nodeToNodeList[i].previousId],
                              nodeList[nodeToNodeList[i].nextId],
                              nodeToNodeList[i].specialActionLabel,
                              nodeToNodeList[i].type, isActive);
                  } catch (e) {
                  }
              }
              drawTooltip(context, nodeList[hintNode]);
          }
      } catch (e) {
          console.log(e);
      }
  };

  //Kiem tra co phai click vao node hay khong?
  this.nodeOver = function (x, y) {
      var i = 0;
      for (i = 0; i < nodeList.length; i++) {
          if (isInNode(x, y, nodeList[i])) {
              return i;
          }
      }
      return -1;
  };

  isInNode = function (x, y, node) {
      if (node == null)
          return false;
      if (x >= node.left && x <= node.right && y >= node.top
              && y <= node.bottom) {
          return true;
      } else {
          return false;
      }
  };

  //Kiem tra co phai click vao duong di hay khong?
  this.curveyOver = function (x, y) {
      var i = 0;
      var line;
      var minx, maxx, miny, maxy;
      for (i = 0; i < nodeToNodeList.length; i++) {
          line = getLinePoints(nodeList[nodeToNodeList[i].previousId],
                  nodeList[nodeToNodeList[i].nextId]);
          minx = line.x1;
          miny = line.y1;
          if (line.x1 >= line.x2) {
              minx = line.x2;
              maxx = line.x1;
          } else {
              minx = line.x1;
              maxx = line.x2;
          }
          if (line.y1 >= line.y2) {
              miny = line.y2;
              maxy = line.y1;
          } else {
              miny = line.y1;
              maxy = line.y2;
          }

          minx -= 40;
          maxx += 40;
          miny -= 40;
          maxy += 40;

          if (x < minx || x > maxx || y < miny || y > maxy) {
              continue;
          }

          var point = getCenterpoint(line.x1, line.y1, line.x2, line.y2);
          var r = Math.sqrt((point.x - x) * (point.x - x) + (point.y - y)
                  * (point.y - y))
          if (Math.abs(point.r - r) <= 10) {
              return i;
          }

      }
      return -1;

  };

  //
  // Su dung de kiem tra click vao duong ko trong truong hop ve duong thang
  // ( gio da chuyen sang ve duong cong nen dung this.curveyOver
  //
  this.lineOver = function (x, y) {
      var i = 0;
      var line;
      var minx, maxx, miny, maxy;
      for (i = 0; i < nodeToNodeList.length; i++) {
          line = getLinePoints(nodeList[nodeToNodeList[i].previousId],
                  nodeList[nodeToNodeList[i].nextId]);
          minx = line.x1;
          miny = line.y1;
          if (line.x1 >= line.x2) {
              minx = line.x2;
              maxx = line.x1;
          } else {
              minx = line.x1;
              maxx = line.x2;
          }
          if (line.y1 >= line.y2) {
              miny = line.y2;
              maxy = line.y1;
          } else {
              miny = line.y1;
              maxy = line.y2;
          }

          minx -= 10;
          maxx += 10;
          miny -= 10;
          maxy += 10;

          if (x < minx || x > maxx || y < miny || y > maxy) {
              continue;
          }

          if (line.x1 == line.x2) {
              // console.log("x="+x+";x1="+line.x1);
              if (Math.abs(x - line.x1) <= 10) {
                  return i;
              }
          } else {
              var a = (line.y1 - line.y2) / (line.x1 - line.x2);
              var b = (line.y2 * line.x1 - line.y1 * line.x2)
                      / (line.x1 - line.x2);
              var y3 = a * x + b;
              if (Math.abs(y3 - y) <= 10) {
                  return i;
              }
              // console.log("a="+a+"b="+b);
              // console.log("x1="+line.x1+";x2="+line.x2+";y1="+line.y1+";y2="+line.y2);
              // console.log("x="+x+";y="+y+";y3="+y3);
          }
      }
      return -1;

  };

  this.whereIsActiveNode = function (x, y) {
      var i = 0;
      if (mouseFlags == 1) {
          // console.log("here");
          if (activeNode >= 0) {
              // console.log("active node");
              var width = nodeList[activeNode].right
                      - nodeList[activeNode].left;
              var height = nodeList[activeNode].bottom
                      - nodeList[activeNode].top;
              nodeList[activeNode].left = x;
              nodeList[activeNode].top = y;
              nodeList[activeNode].right = x + width;
              nodeList[activeNode].bottom = y + height;
              // console.log("before draw");

              this.drawGraph();
          }
      } else {
          for (i = 0; i < nodeList.length; i++) {
              if (isInNode(x, y, nodeList[i])) {
                  if (hintNode != i) {
                      hintNode = i;
                      this.drawGraph();
                      return;
                  } else {
                      return;
                  }
              }
          }
          if (hintNode != -1) {
              hintNode = -1;
              this.drawGraph();
          }
      }
  };

  this.clickInGraph = function (x, y) {
      // console.log("clickInGraphic");
      var inp = document.getElementById("txtNodeName");
      if (inp != null) {
          if (inp.style.display == "") {
              inp.style.display = "none";
          }
      }

      var reDraw = false;
      var selectNode = this.nodeOver(x, y);

      if (selectNode != activeNode) {
          activeNode = selectNode;
          reDraw = true;
      }

      if (activeNode < 0) {
          var selectLine = this.curveyOver(x, y);
          if (selectLine != activeLine) {
              activeLine = selectLine;
              reDraw = true;
          }
      } else {
          activeLine = -1;
          if (activeNode >= 0 && select == 0) {
              mouseFlags = 1;
          }

          if (select == 1) {
              firstSelectNode = activeNode;
              select = 2;
          } else if (select == 2) {
              var addNewNodeToNode = true;
              if (firstSelectNode == activeNode) {
                  addNewNodeToNode = false;
              } else {
                  for (var i = 0; i < nodeToNodeLength; i++) {
                      if (nodeToNodeList[i].previousId == firstSelectNode
                              && nodeToNodeList[i].nextId == activeNode) {
                          addNewNodeToNode = false;
                          break;
                      }
                  }
              }
              if (addNewNodeToNode) {
                  var nodeToNode = new Object();

//					nodeToNode.previousId = nodeList[firstSelectNode].nodeId;
//					nodeToNode.nextId = nodeList[activeNode].nodeId;

                  nodeToNode.previousId = nodeList[firstSelectNode].nodeId;
                  nodeToNode.nextId = nodeList[activeNode].nodeId;
                  nodeToNode.type = buttonType;
                  onAddNodeToNode.call(this,nodeToNode)
//					nodeToNodeList[nodeToNodeLength] = nodeToNode;
//					nodeToNodeLength += 1;
//					reDraw = true;

                  // var wgt = zk.Widget.$("$flowConfigDlg");
                  // zAu.send(new zk.Event(wgt, 'onAddNodeToNode', JSON.stringify(nodeToNode)));
              }
              select = 1;
          }
      }
      if (reDraw) {
          this.drawGraph();
      }
  };

  this.updateFromForm = function () {
      var nodeName = document.getElementById("viewNodeForm.nodeName").value;
      var nodeId = document.getElementById("viewNodeForm.nodeId").value;
      var status = document.getElementById("viewNodeForm.status").value;
      var id = document.getElementById("viewNodeForm.id").value = nodeList[activeNode].id;
      var grid = dijit.byId("nodeToNodeGrid");
      //
      // cap nhat node name
      //
      for (var i = 0; i <= nodeLength; i++) {
          if (nodeList[i].id == id) {
              nodeList[i].nodeId = nodeId;
              nodeList[i].nodeName = nodeName;
              nodeList[i].status = status;
              break;
          }
      }
      //
      // xoa cac quan he bi xoa
      //
      for (var i = nodeToNodeLength - 1; i >= 0; i--) {
          if (nodeList[nodeToNodeList[i].previousId].id == id) {
              var have = false;
              for (var j = 0; j < grid._by_idx.length; j++) {
                  var item = grid.getItem(j);
                  if (item.nextId == nodeToNodeList[i].nextId) {
                      have = true;
                      nodeToNodeList[i].action = item.action;
                      break;
                  }
              }
              if (!have) {
                  nodeToNodeList.splice(i, 1);
                  nodeToNodeLength--;
              } else {
              }
          }
      }
      this.drawGraph();
  };

  this.showNodeContent = function () {
      //var wgt = zk.Widget.$("$flowConfigDlg");
      if (activeNode >= 0) {
          nodeData = nodeList[activeNode];
          nodeData.flowId = this.flowId;
          // zAu.send(new zk.Event(wgt, 'onLoadNodeData', JSON
          //         .stringify(nodeData)));
          onLoadNodeData.call(this,nodeData)
      }
      if (activeLine >= 0) {
          var lineData = nodeToNodeList[activeLine]
          //zAu.send(new zk.Event(wgt, 'onLoadNodeToNode', JSON.stringify(lineData)));
          var nodeToNode = new Object();
          nodeToNode.previousId = nodeList[lineData.previousId].nodeId;
          nodeToNode.nextId = nodeList[lineData.nextId].nodeId;
          nodeToNode.type = lineData.type;
          nodeToNode.specialActionKey = lineData.action;
          nodeToNode.id = lineData.id;
          onLoadNodeToNode.call(this,nodeToNode)
      }
  };

  this.mouseUp = function () {
      mouseFlags = 0;
      if (!isChangeGraph) {
          isChangeGraph = true;
      }

      if (activeNode >= 0) {
        nodeUpdate.call(this,nodeList[activeNode])
      }

  };

  this.keyPress = function (e) {
      var inp = document.getElementById("txtNodeName");
      if (inp == null)
          return;
      var left;
      var top;
      var width;
      var height;
      var canvas = document.getElementById("flowNode");
      var displayInp = false;

      if (activeNode >= 0) {
//			displayInp = true;
//			//
//			// if user is typing and press enter or tab -> will update and
//			// finish input
//			//
//			if (inp.style.display == "") {
//				if (e.keyCode == 13 || e.keyCode == 9) {
//					this.setActiveNodeText(inp.value);
//					inp.style.display = "none";
//				} else if (e.keyCode == 27) {
//					inp.style.display = "none";
//				}
//				return;
//			}
//			//
//			// user press backspace and delete when select node
//			//
//			if (e.keyCode == 8 || e.keyCode == 46) {
//				this.deleteNode(nodeList[activeNode].id);
//				e.returnValue = false;
//				return;
//			}
//                        else if (e.keyCode == 9) {
//				activeNode++;
//				if (activeNode >= nodeLength) {
//					activeNode = 0;
//				}
//				this.drawGraph();
//				e.returnValue = false;
//				return;
//			} else if (e.keyCode < 65 || e.keyCode > 90) {
//                            return;
//                        }
//			//
//			// show input at node position
//			//
//			left = nodeList[activeNode].left + canvas.offsetLeft;
//			top = nodeList[activeNode].top + canvas.offsetTop;
//			width = nodeList[activeNode].right - nodeList[activeNode].left;
//			height = nodeList[activeNode].bottom - nodeList[activeNode].top;
      } else if (activeLine >= 0) {
//			displayInp = true;
//			//
//			// if user is typing and press enter or tab -> will update and
//			// finish input
//			//
//			console.log(e.keyCode);
//			if (inp.style.display == "") {
//				if (e.keyCode == 13 || e.keyCode == 9) {
//					this.setActiveLineText(inp.value);
//					inp.style.display = "none";
//				} else if (e.keyCode == 27) {
//					inp.style.display = "none";
//				}
//				return;
//			}
//			//
//			// user press backspace and delete when select node
//			//
//			if (e.keyCode == 8 || e.keyCode == 46) {
//				this.deleteNodeToNode(activeLine, true);
//				e.returnValue = false;
//				return;
//			}
//			else if (e.keyCode == 9) {
//				activeLine++;
//				if (activeLine >= nodeToNodeLength) {
//					activeLine = 0;
//				}
//				this.drawGraph();
//				e.returnValue = false;
//				return;
//			}
//
//			//
//			// show input at node position
//			//
//			var line = getLinePoints(
//					nodeList[nodeToNodeList[activeLine].previousId],
//					nodeList[nodeToNodeList[activeLine].nextId]);
//			left = (line.x1 + line.x2 - nodeWidth) / 2 + canvas.offsetLeft;
//			top = (line.y1 + line.y2 - nodeHeight) / 2 + canvas.offsetTop;
//			width = nodeWidth;
//			height = nodeHeight;
      }
      if (displayInp) {
          inp.style.top = top + "px";
          inp.style.left = left + "px";
          inp.style.width = width + "px";
          inp.style.height = height + "px";
          inp.style.display = "";
          inp.value = "";
          inp.focus();
      }

      if (!isChangeGraph) {
          isChangeGraph = true;
      }
  };

  this.setActiveNodeText = function (text) {
      if (activeNode < 0) {
          return;
      }
      nodeList[activeNode].nodeName = text;
      this.drawGraph();
  };

  this.setActiveLineText = function (text) {
      if (activeLine < 0) {
          return;
      }
      nodeToNodeList[activeLine].action = text;
      this.drawGraph();
  };
};

function findPos(obj) {
  var curleft = 0;
  var curtop = 0;
  if (obj.offsetParent) {
      do {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
      return {
          x: curleft,
          y: curtop
      };
  }
  return undefined;
}

drawProcess = function (canvasId) {
  /*
   * Khoi tao cac gia tri
   */
  var graph = new drawFlow(canvasId);
  if (!graph.checkIEVersion())
      return;

  var canvas = document.getElementById(canvasId);
  var maxWidth = canvas.clientWidth;
  var maxHeight = canvas.clientHeight;

  document.getElementById(canvasId).onmousedown = function (e) {
      var dataFlow = document.getElementById(canvasId);
      var div = dataFlow.parentNode;
      var pos = findPos(dataFlow);
      var canvas_x = e.pageX - pos.x + div.scrollLeft;
      var canvas_y = e.pageY - pos.y + div.scrollTop;
      graph.clickInGraph(canvas_x, canvas_y);
      return false;
  };

  document.getElementById(canvasId).onmouseup = function (e) {
      graph.mouseUp();
  };

  document.getElementById(canvasId).ondblclick = function (e) {
      graph.showNodeContent();
      return false;
  };

  document.getElementById(canvasId).onmousemove = function (e) {
      var dataFlow = document.getElementById(canvasId);
      var div = dataFlow.parentNode;
      var pos = findPos(dataFlow);
      var canvas_x = e.pageX - pos.x + div.scrollLeft;
      var canvas_y = e.pageY - pos.y + div.scrollTop;
      graph.whereIsActiveNode(canvas_x, canvas_y);

  };

  graph.resize(maxWidth, maxHeight);// mo rong de hien thi tooltip
  return graph;
};
