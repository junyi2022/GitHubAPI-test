---
title: "Add and style a vector tile layer showing the most recent tax year assessment values on the map"
labels: ["Front-end"]
---

The tiles are stored in Google Cloud Storage (GCS). These tiles will be updated as part of the data pipeline.

The features in the vector tiles contain the following properties:
* `property_id`: The unique identifier for each property (9-10 digit number corresponding to OPA `parcel_number` or the PWD `BRT_ID`).
* `address`: The address of the property.
* `tax_year_assessed_value`: The assessed value of the property according to the most recent tax year.
* `current_assessed_value`: The assessed value of the property according to the ML model.

There are a few things to keep in mind:
* The URL template for the tiles is `https://storage.googleapis.com/musa5090s24_team<N>_public/tiles/properties/{z}/{x}/{y}.pbf`, and the name of the layer with property information is `property_tile_info`.
* The tiles are vector tiles, so Leaflet won't be able to handle them without a plugin. For a Leaflet map, you can use the [Leaflet.VectorGrid](https://github.com/Leaflet/Leaflet.VectorGrid) plugin. Alternatively, if you'd like to try a native vector tile mapping library, [you can try Maplibre GL JS](https://maplibre.org/maplibre-gl-js/docs/).
* Style the layer by coloring each feature according to the assessed value of each property. Choose a color ramp, and appropriate breakpoints for each color.
  * You can find an example of applying styles based on feature properties for [Leaflet.VectorGrid here](https://github.com/Leaflet/Leaflet.VectorGrid/blob/master/docs/demo-geojson.html#L40), and you can find documentation for styling `VectorGrid` layers at https://leaflet.github.io/Leaflet.VectorGrid/vectorgrid-api-docs.html#styling-vectorgrids
  * You can find an example of applying styles based on feature properties for [Maplibre GL JS here](https://maplibre.org/maplibre-gl-js/docs/examples/data-driven-lines/), and you can find documentation for styling `Maplibre GL JS` layers at https://maplibre.org/maplibre-style-spec -- note that the style specification is the same as the Mapbox GL JS style spec, so you can refer to examples in the Mapbox GL JS documentation as well.
* If you need things like the maximum and minimum assessed values to set the color ramp, which may change each time the underlying data changes, you may want to create an additional JSON file in your public GCS bucket with this information.

Acceptance criteria:
- [ ] A tile layer with property features colored by the predicted assessed value visible on the map