### This is a small Modal creation utility that I made in order to dynamically generate Modals on the fly.

I wrote this because I ran into the problem at work of having to hardcode our modals individually. 
Each member of the team were writing their own modals, overlays and other UI elements. Since we are
stuck still utilizing jQuery on a recent project, `

I designed this in vanilla JS, but it allows for attaching elements to a container defined as a jQuery object.
This will likely be iterated over a few more times in order to customize more, after testing is done.

Currently supported options.

```javascript
{
  container: jQuery Object || HTMLElement Node || selector String, // [optional]
  title: String, // [optional]
  body: String || HTMLElement Node, // [required]
  buttonCloseText: String, // [optional]
  buttonCloseCallback: function, // [optional]
  buttonPrimaryText: String, // [optional]
  buttonPrimaryCallback: function, // [optional]
  startPositionTop: String, // (ex. '10%') [optional]
  startPositionLeft: String, // (ex. '10%') [optional]
  startOpacity: String // (ex. '0', '0.5', etc) [optional
  transitionDuration: String // (ex. '1s', '1.5s', etc) [optional]
}
```

The modal can also be created by passing in a string or HTMLElement.

```javascript
var modal = ACModal.init('This will be a generic modal');

var el = document.createElement('p');
var textNode = document.createTextNode('This will contain a <p></p> element');
el.appendChild(textNode);

var modal = ACModal.init(el); // Not guaranteed to work completely, in progress
```
