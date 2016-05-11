# rule-select

Select and apply css rules with css selectors

## Usage

app.jade:

```jade

import {mount} from 'ui-kit-rule-select'
import './index.ess'

:module
  export var mixins = [mount];
```

index.ess:

```
import R from 'src/modules/rule-select/index.js'

div
  color red

span
  color R['div']['color']
```

## Example

![screenshot](http://i.imgur.com/Vcy6DzJ.png)

In this simple example, our app has loaded the [materialize css framework](https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/css/materialize.css) on
the page. But instead of applying a lot of classes and rules to our markup, we
can pluck out the rule values we want and assign them individually to rules
and selectors that we choose.

jade:

```jade
h1 woah
h2 cool
h3 nice

.primary i'm primary colored
.accent i'm accent
```

ess:

```stylus
import R from 'src/modules/rule-select/index.js'

// with this function, you can use css
// rules on the page as variables

h1
  color blue

h2
  background = R['h1']['color']

// external scripts works just as well

h2
  border 5px solid
  border-color = R['.materialize-red']['background-color']
  color = R['.green.lighten-2']['background-color']

// you can reference rules that are
// pointing to other rules if you want

h3
  background-color = R['h2']['border-color']

// or leverage custom properties to piece together
// your custom palette

:root
  --primary = R['.orange.lighten-1']['background-color']
  --accent = R['.purple.darken-2']['background-color']

.primary
  background var(--primary)
.accent
  background var(--accent)
```

## License

MIT
