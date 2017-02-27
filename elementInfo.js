let isEnabled = false;
let element = null;
let previousElement = null;
let x = null;
let y = null;
let activeAttrIndex = null;

const keys = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  13: 'enter',
  27: 'esc',
  69: 'e',
  76: 'l'
};

$('body').on('keydown', (e) => {
  if (e.ctrlKey && keys[e.keyCode] === 'l') {
    isEnabled = !isEnabled;
    if (!isEnabled){
      $('#elementInfoWrapper').remove();
    }
    const message = isEnabled ? 'Active!' : 'Inactive!';
    sendMessage(message);
  }

  if (isEnabled && keys[e.keyCode] === 'down') {
    preventDefaultForScrollKeys(e);
    activeAttrIndex = $('.hljs-string').index($('.elementInfoActive')) + 1;

    $('.hljs-string').removeClass('elementInfoActive');
    $('.hljs-string').eq(activeAttrIndex).addClass('elementInfoActive');
  }

  if (isEnabled && keys[e.keyCode] === 'up') {
    preventDefaultForScrollKeys(e);
    activeAttrIndex = $('.hljs-string').index($('.elementInfoActive')) - 1;
    $('.hljs-string').removeClass('elementInfoActive');
    if (activeAttrIndex > -1){
      $('.hljs-string').eq(activeAttrIndex).addClass('elementInfoActive');
    }
  }

  if (isEnabled && keys[e.keyCode] === 'left') {
    previousElement = element;
    element = $(element).parent()[0];
    displayElementInfo();
  }

  if (isEnabled && keys[e.keyCode] === 'right') {
    element = previousElement;
    displayElementInfo();
  }

  if (isEnabled && keys[e.keyCode] === 'enter') {
    e.preventDefault();
    const clipboard = new Clipboard('.elementInfoActive', {
      text: function(trigger) {
        return $(trigger).text();
      }
    });
    $('.elementInfoActive').click();
    $('#elementInfoWrapper').remove();
  }

  if (isEnabled && keys[e.keyCode] === 'esc') {
    $('#elementInfoWrapper').remove();
  }

  if (isEnabled && keys[e.keyCode] === 'e') {
    const siteId = $('.select-current-site-js').val();
    const clipboard = new Clipboard('body', {
      text: function(trigger) {
        return siteId;
      }
    });
    $('body').click();
    sendMessage(`Site Id ${siteId} Copied!`);
  }

});

$('body').on('mousedown', (event) => {
  const isCodeParent = $(event.target).attr('id') === 'elementInfo';
  const isCodeChild = $(event.target).parents('#elementInfo').length;
  if (isEnabled && !isCodeParent && !isCodeChild) {
    element = event.target;
    x = event.pageX;
    y = event.pageY;
    console.log(element);
    displayElementInfo();
  }
});

preventDefault = (e) => {
  e = e || window.event;
  if (e.preventDefault)
    e.preventDefault();
  e.returnValue = false;
}

preventDefaultForScrollKeys = (e) => {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

displayElementInfo = () => {
  $('#elementInfoWrapper').remove();
    const x2 = x + 10;
    const y2 = y + 10;
    const html = indentHtml(element.outerHTML).replace(/&/g, '&amp;').replace(/</g, '&lt;');

    const infoDiv = `<div id="elementInfoWrapper" style="top: ${y2}px; left: ${x2}px;">
                      <pre>
                          <code id="elementInfo" class="html">${html}</code>
                      </pre>
                     </div>`;
    $(document.body).append(infoDiv);
    $('#elementInfoWrapper pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
};

sendMessage = (message) => {
  $('#eiMessageDiv').remove();
  $('body').append(`<div id="eiMessageDiv">${message}</div>`);
  setTimeout(() => {
    $('#eiMessageDiv').remove();
  }, 1500);
}