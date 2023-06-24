# polr-android-tv-remote-card

A Lovelace card designed as a companion to the [Android TV Remote](https://www.home-assistant.io/integrations/androidtv_remote/) integration.

## Installation

### HACS

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?repository=polr-android-tv-remote-card&category=Lovelace&owner=pathofleastresistor)

1. Open the HACS section of Home Assistant.
2. Click the "..." button in the top right corner and select "Custom Repositories."
3. In the window that opens paste this Github URL.
4. Select "Lovelace"
5. In the window that opens when you select it click om "Install This Repository in HACS"

### Manually

1. Copy `polr-android-tv-remote-card.js` into your `<config>/<www>` folder
2. Add `polr-android-tv-remote-card.js` as a dashboard resource.

## Usage

### Settings

<table>
    <tr>
        <th>Field</th>
        <th>Required</th>
        <th>Examples</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>entity__id</td>
        <td>yes</td>
        <td>
<pre>
entity_id: remote.atvremote
</pre>
        </td>
        <td>Must be a remote entity created by the new Android TV integration</td>
    </tr>
    <tr>
        <td>apps</td>
        <td>no</td>
        <td>
<pre>
apps:
  - disneyplus
  - icon: mdi:youtube
    url: https://www.youtube.com
</pre>
        </td>
        <td>Must be a remote entity created by the new Android TV integration</td>
    </tr>
    <tr>
        <td>remote</td>
        <td>no</td>
        <td>
<pre>
remote: default
</pre>
        </td>
        <td><code>default</code>, <code>dpad</code>, <code>touch</code></td>
    </tr>
    <tr>
        <td>volume</td>
        <td>no</td>
        <td>
<pre>
volume: false
</pre>
        </td>
        <td>Must be a remote entity created by the new Android TV integration</td>
    </tr>
</table>

### Supported apps

| App          | Value        |
| ------------ | ------------ |
| Disney Plus  | `disneyplus` |
| HBO Max      | `hbomax`     |
| Netflix      | `netflix`    |
| Amazon Prime | `prime`      |

### Custom apps

If the app you want isn't supported, you can still add it by including a `icon` and `url` in the `apps` array.

### Example

```
type: custom:polr-android-tv-remote-card
entity_id: remote.android_tv_remote
remote: touch
apps:
    - disneyplus
    - hbomax
    - netflix
    - prime
    - icon: mdi:youtube
      url: https://www.youtube.com
```

### Screenshot

<p align="center">
  <img width="600" src="images/card-config.png">
</p>

### Customization

It's still possible that the card isn't perfect for you so you need to make some customizations. Every button can be overridden to call a service, including custom apps.

| Button                     | YAML Key     |
| -------------------------- | ------------ |
| Up                         | `up`         |
| Down                       | `down`       |
| Left                       | `left`       |
| Right                      | `right`      |
| Center                     | `center`     |
| Power                      | `power`      |
| Home                       | `home`       |
| Back                       | `back`       |
| Favorite (only on default) | `favorite`   |
| Volume Up                  | `volumeup`   |
| Volume Down                | `volumedown` |
| Volume Mute                | `volumemute` |

Here's an example card config showing these overrides:

```
type: custom:polr-android-tv-remote-card
entity_id: remote.atvremote_2
remote: touch
apps:
  - service: remote.send_command
    data:
      command: volumedown
      device: livingroomtv
      entity_id: remote.living_room_ir_repeater
    icon: mdi:volume-low
power:
  service: remote.send_command
  data:
    command: power
    device: livingroomtv
    entity_id: remote.living_room_ir_repeater
up:
  service: remote.send_command
  data:
    command: up
    device: livingroomtv
    entity_id: remote.living_room_ir_repeater
down:
  service: remote.send_command
  data:
    command: down
    device: livingroomtv
    entity_id: remote.living_room_ir_repeater
left:
  service: remote.send_command
  data:
    command: left
    device: livingroomtv
    entity_id: remote.living_room_ir_repeater
right:
  service: remote.send_command
  data:
    command: right
    device: livingroomtv
    entity_id: remote.living_room_ir_repeater
back:
  service: remote.send_command
  data:
    command: back
    device: livingroomtv
    entity_id: remote.living_room_ir_repeater
center:
  service: remote.send_command
  data:
    command: center
    device: livingroomtv
    entity_id: remote.living_room_ir_repeater
favorite:
  service: remote.send_command
  data:
    command: volumedown
    device: livingroomtv
    entity_id: remote.living_room_ir_repeater
volumedown:
  service: remote.send_command
  data:
    command: volumedown
    device: livingroomtv
    entity_id: remote.living_room_ir_repeater
volumeup:
  service: remote.send_command
  data:
    command: volumeup
    device: livingroomtv
    entity_id: remote.living_room_ir_repeater
volumemute:
  service: remote.send_command
  data:
    command: volumemute
    device: livingroomtv
    entity_id: remote.living_room_ir_repeater
```

Because you can also override custom apps, you could for example add a button to set the lights in room.
