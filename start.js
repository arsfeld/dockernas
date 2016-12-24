#!/usr/bin/env node

//var Docker = require('dockerode');

var bunyan = require('bunyan');
let dockerhub = require('docker-hub-api');
let drc = require('docker-registry-client');

let REPO = "freenas";

// This package uses https://github.com/trentm/node-bunyan for logging.
var log = bunyan.createLogger({
    name: 'regplay',
    // TRACE-level logging will show you all request/response activity
    // with the registry. This isn't suggested for production usage.
    //level: 'trace'
});

dockerhub.repositories(REPO).then((images) => {
    //console.log(images);
    for (let image of images) {
        let repo = drc.parseRepoAndRef(`${REPO}/${image.name}`);
        let client = drc.createClientV2({repo: repo, log})
        
        client.getManifest({ref: 'latest'}, function (err, manifest, res) {
            client.close();
            if (err) {
                mainline.fail(cmd, err, opts);
            }
            
            let params = JSON.parse(manifest.history[0].v1Compatibility);
          
            //log.info(image)  
            log.info(params.config.Labels)
            
            /*
            for (let label of params.config.Labels) {
                if (!label.startsWith("org.freenas")) {
                    log.info(label);
                }
            }
            */
            
            //log.info(JSON.parse(labels))
            
            //console.log(JSON.stringify(manifest, null, 4));
        })
    }
})
