# Analysis tree

Here is the tree example for a DVB signal anaylized by mediahub-admin.

├── Transport stream ${ts.id}
├── Service (${number_of_service})
│   ├── ${service['is-scrambled']} ${service.name} ${service.id} ${service.bitrate}
│   │    ├── ${pid.type} ${pid.id} ${service.bitrate}
│   │    ├── ${pid.type} ${pid.id} ${service.bitrate}
│   │    ├── ${pid.type} ${pid.id} ${service.bitrate}
│   ├── ${service['is-scrambled']} ${service.name} ${service.id} ${service.bitrate}
├── Tables

The result should appear like this
![Analysis tree](/public/img/analysis_tree.png)
