// http://stackoverflow.com/questions/26360414/javascript-how-to-correct-indentation-in-html-string
indentHtml = (html) => {
  var div = document.createElement('div');
  div.innerHTML = html.trim();
  return format(div, 0).innerHTML;
}

format = (node, level) => {
  var indentBefore = new Array(level++ + 1).join('  '),
    indentAfter  = new Array(level - 1).join('  '),
    textNode;

  for (var i = 0; i < node.children.length; i++) {
    textNode = document.createTextNode('\n' + indentBefore);
    node.insertBefore(textNode, node.children[i]);

    format(node.children[i], level);

    if (node.lastElementChild == node.children[i]) {
      textNode = document.createTextNode('\n' + indentAfter);
      node.appendChild(textNode);
    }
  }

  return node;
}