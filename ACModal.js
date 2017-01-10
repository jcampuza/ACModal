var ACModal = function() {
  var OPTIONS;
  var builtModal;
  
  var customEvents = {
    attached: new Event('attached'),
    destroyed: new Event('destroyed')
  };
  var module = {};
  
  function checkOption(option) {
    if (OPTIONS.hasOwnProperty(option) && OPTIONS[option] !== undefined) {
      return true;
    }
    return false;
  }
  
  function buildModal() {
    // Build the structural elements of the Modal
    var overlay = document.createElement('div');
    var modal = document.createElement('div');
    var contentBody = document.createElement('div');
    var contentActions = document.createElement('div');
    
    overlay.className = 'ac-modal-container';
    modal.className = 'ac-modal-content';
    contentBody.className = 'ac-modal-content__body';
    contentActions.className = 'ac-modal-content__actions';
    
    if (checkOption('title')) {
      var title = buildTitle(OPTIONS.title);
      contentBody.appendChild(title);
    }
    
    if (checkOption('body')) {
      var body = buildBody(OPTIONS.body);
      contentBody.appendChild(body);
    }
    
    if (checkOption('buttonCloseText')) {
      var secondaryButton = buildButton('close', OPTIONS.buttonCloseText, OPTIONS.buttonCloseCallback);
      contentActions.appendChild(secondaryButton);
    } else {
      var secondaryButton = buildButton('close');
      contentActions.appendChild(secondaryButton);
    }
    
    if (checkOption('buttonPrimaryText')) {
      var primaryButton = buildButton('interactive', OPTIONS.buttonPrimaryText, OPTIONS.buttonPrimaryCallback);
      contentActions.appendChild(primaryButton);
    }
    
    modal.appendChild(contentBody);
    modal.appendChild(contentActions);
    
    modal.style = "transform: translate";
    overlay.appendChild(modal);
    
    return overlay;
  }
  
  function buildTitle(titleText) {
    var title = document.createElement('h3');
    var textContent = document.createTextNode(titleText);
    
    title.className = 'ac-modal-content__title';
    title.appendChild(textContent);
    
    return title;
  }
  
  function buildBody(bodyText) {
    var body = document.createElement('p');
    var textContent = (bodyText instanceof HTMLElement) ? bodyText : document.createTextNode(bodyText);
    
    body.className = 'ac-modal-content__text';
    body.appendChild(textContent);
    
    return body;
  }
  
  function buildButton(type, buttonText, buttonCallback) {
    var textNode = document.createTextNode.bind(document);
    var buttonContent = (typeof buttonText === 'undefined') ? textNode('Close') : textNode(buttonText);
    
    var btn = document.createElement('button');
    btn.appendChild(buttonContent);
    if (type === 'close') {
      btn.className = 'btn-cancel';
      btn.addEventListener('click', destroyModal);
    } else {
      btn.className = 'btn-success';
    }
    
    if (typeof buttonCallback === 'function') {
      btn.addEventListener('click', buttonCallback);
    }
    
    return btn;
  }
  
  function destroyModal() {
    if (builtModal) {
      builtModal.dispatchEvent(customEvents.destroyed);
      builtModal.parentNode.removeChild(builtModal);
      builtModal = null;
    }
  }
  
  function executeTransitions(event) {
    var modal = event.target;
    if (modal.style.top) modal.style.top = OPTIONS.endingPositionTop || '50%';
    if (modal.style.left) modal.style.left = OPTIONS.endingPositionLeft || '50%';
    if (modal.style.opacity) modal.style.opacity = 1;
  }
  
  function attachTransitions(overlay) {
    var modal = overlay.querySelector('.ac-modal-content');
    modal.style.top = checkOption('startPositionTop') ? OPTIONS.startPositionTop : '' ;
    modal.style.left = checkOption('startPositionLeft') ? OPTIONS.startPositionLeft : '';
    modal.style.opacity = checkOption('startOpacity') ? OPTIONS.startOpacity : '';
    modal.style.transitionDuration = checkOption('transitionDuration') ? OPTIONS.transitionDuration : '';
    
    if (modal.style.top || modal.style.left || modal.style.opacity) {
      modal.addEventListener('attached', executeTransitions);
    }
  }
  
  module.init = function(options) {
    if (typeof options === 'undefined') {
      console.error('ACModal requires an options object in order to function');
      return;
    } else if (typeof options === 'string') {
      options = {body: options};
    } else if (options instanceof HTMLElement) {
      options = {body: options};
    }
    
    OPTIONS = options;
    if (!checkOption('body')) {
      console.error('When passing in an options object, ACModal requires that a property \'body\' is defined');
      return;
    }
    
    var modal = buildModal();
    var modalContent = modal.firstChild;
    var containerEl;
    builtModal = modal;
    
    if (checkOption('container')) {
      if (OPTIONS.container instanceof HTMLElement) {
        containerEl = OPTIONS.container;
      // jQuery is common enough to check if we are handed a jQuery object
      } else if (typeof jQuery !== 'undefined' && OPTIONS.container instanceof jQuery) {
        containerEl = OPTIONS.container[0];
      } else if (typeof OPTIONS.container === 'string') {
        containerEl = document.querySelector(OPTIONS.container);
      }
    } else {
      containerEl = document.querySelector('body');
    }
    
    if (typeof containerEl === 'undefined') {
      console.error('Unable to attach event to a DOM Element. Maybe there was a typo or the specified container element isn\'t defined?', OPTIONS.container);
      return;
    }
    
    attachTransitions(builtModal);
    containerEl.appendChild(builtModal);
    modalContent.dispatchEvent(customEvents.attached);
    
    if (checkOption('closeTimer') && OPTIONS.closeTimer !== 0) {
      window.setTimeout(destroyModal, OPTIONS.closeTimer);
    }
  };
  
  return module;
};
