# `ImageOpt` Frontend Component

This component is written using [VueJS]() but is transpiled to both a
native VueJS component as well as a framework agnostics Web "custom component".

The goal of both of these artifacts is to be able to leverage the _optimized images_
-- which the CLI makes easy to produce -- as quickly and as effectively as possible.

These components will produce an HTML `<picture>...</picture>` group with sources for
for each image format which you specify. Without JS there's no way to pair the power
of _container queries_ with viewport width so to get around this, the component's
JS will detect the component's available width as a percentage of the viewport
and with that make sure that the **picture** sources are targetting the correct
width available to the container.
