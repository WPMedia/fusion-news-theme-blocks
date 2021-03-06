# `@wpmedia/ad-taboola-widget`
_Block that implement a [Taboola Widget](https://www.taboola.com/)._

## Props

### Global
| **Prop** | **Required** | **Description** |
|---|---|---|
| **taboolaPublisherId** | yes | Publisher ID provided by Taboola |

This configuration need to added to `blocks.json` like this:
```
{
    ...
    "values": {
        "default": {
            "siteProperties": {
                ...
                "taboolaPublisherId": "client-publisher-id",
                ...
            }
        }
    }
}
```

### Per widget
| **Prop** | **Required** | **Description** |
|---|---|---|
| **taboolaPlacement** | yes | Widget placement description, provided by Taboola |
| **taboolaMode** | yes | Widget mode, provided by Taboola |
| **taboolaContainer** | yes | Widget container name, provided by Taboola |

This properties will be defined on each block added to the page.


## Reference Material

[Implementing Taboola Javascript Placement Code](https://pubhelp.taboola.com/hc/en-us/articles/360003181054-Implementing-Javascript-Placement-Code)

## Additional Considerations
The block will not render inside PageBuilder editor. Inside the editor, when the widget has his properties correctly configured, will show a dummy block with the placement name.
To see the widget working, need to publish the page and on the preview url add the parameter `&taboola_sim_domain=XXX`, replacing XXX with the domain provided by Taboola for testing.
