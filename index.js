/**
 * Module dependencies
 */

import * as putSelector from 'put-selector';
import {camel} from 'change-case';

var mount = {};

mount.componentDidMount = function() {
  var styles = this.styles;
  var style = this.style;

  if (!style.sheet) document.body.appendChild(style);

  document.addEventListener('DOMContentLoaded', e => {
    this.applyStyles();
  });
}

mount.createProxy = function() {
  this.styles = {};

  if (!this.hidden) {
    this.hidden = document.createElement('div');
    this.hidden.style.display = 'none';
    document.body.appendChild(this.hidden);
  }

  if (!this.style) {
    this.style = document.createElement('style');
    this.hidden.appendChild(this.style);
  }

  return this.proxy = new Proxy({}, handler(this.styles));
};

mount.applyStyles = function() {
  var styles = this.styles;
  var style = this.style;

  var buf = [':root {'];
  for (var s in styles) {
    if (/^__/.test(s)) continue;
    if (s === 'splice') continue;
    var selector = s.replace(/\\/g, '');
    var el = putSelector(selector);
    this.hidden.appendChild(el);
    var computed = window.getComputedStyle(el);
    for (var r in styles[s]) {
      buf.push(`  --${s}-${r}: ${computed[r]};`);
    }
    style.textContent = buf.join('\n');
  }
  buf.push('}');

  style.textContent = buf.join('\n');

  console.log('applied root', style.textContent);
}

function handler(styles) {
  return {
    get: function(target, prop) {
      if (target[prop]) return target[prop];
      return create(prop);
    }
  };

  function create(sel) {
    sel = sel.replace(/([^\w-_])/g, '\\$1');
    if (!styles[sel]) styles[sel] = {};
    return new Proxy({}, {
      get: function(target, rule) {
        var ruleCamel = camel(rule);
        styles[sel][ruleCamel] = 1;
        return `var(--${sel}-${ruleCamel})`;
      }
    })
  }
}

export {mount};

export default mount.createProxy();
