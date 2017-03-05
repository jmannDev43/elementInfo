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

onMouseDown = (event) => {
  const isCodeParent = $(event.target).attr('id') === 'elementInfo';
  const isCodeChild = $(event.target).parents('#elementInfo').length;
  if (isEnabled && !isCodeParent && !isCodeChild) {
    element = event.target;
    x = event.pageX;
    y = event.pageY;
    displayElementInfo();
  }
};

displayToast = (message) => {
  $('#eiMessageDiv').remove();
  $('body').append(`<div id="eiMessageDiv">${message}</div>`);
  $('eiMessageDiv').hide().fadeIn('slow');
  setTimeout(() => {
    $('#eiMessageDiv').fadeOut();
  }, 1500);
}

$('body').on('keydown', (e) => {
  if (e.ctrlKey && keys[e.keyCode] === 'l') {
    isEnabled = !isEnabled;
    if (!isEnabled){
      $('#elementInfoWrapper').remove();
      $('body').off('mousedown', onMouseDown);
    } else {
      $('body').on('mousedown', onMouseDown);
    }
    const message = isEnabled ? 'Active!' : 'Inactive!';
    displayToast(message);
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
    displayToast(`Site Id ${siteId} Copied!`);
  }

});

$('body').on('mousedown', onMouseDown);

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
    const maxWidth = (window.innerWidth - 30);
    const infoDiv = `<div id="elementInfoWrapper" style="top: ${y2}px; max-width: ${maxWidth}px;">
                      <pre>
                          <code id="elementInfo" class="html">${html}</code>
                      </pre>
                     </div>`;
    $(document.body).append(infoDiv);
    const xStyle = getWrapperXStyle();
    $('#elementInfoWrapper').css(xStyle);
    $('#elementInfoWrapper pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
};

getWrapperXStyle = () => {
  const halfWidth = window.innerWidth / 2;
  const wrapperWidth = $('#elementInfoWrapper').width();
  const style = {};
  let sideToSet;
  let sideToClear;
  let val;

  if (wrapperWidth >= (window.innerWidth - 30)){
    sideToSet = 'left';
    sideToClear = 'right';
    val = 10;
  } else if (x <= halfWidth) {
    sideToSet = 'left';
    sideToClear = 'right';
    val = (wrapperWidth + x) >= window.innerWidth ? 10 : x + 10;
  } else {
    sideToSet = 'right';
    sideToClear = 'left';
    val = (wrapperWidth + x) >= window.innerWidth ? 10 : (window.innerWidth - x);
  }

  style[sideToSet] = `${val}px`;
  style[sideToClear] = '';
  return style;
};