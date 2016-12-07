/**
 * Calculate heightData.
 */
self.addEventListener('message', function(e) {
    let [eventKey, options] = e.data;
    let verticesIndex = 0;

    // Calculate z from colorData.
    for (var index = 0; index < options.heightData.length; index += (4)) {
        var all = options.heightData[index] + options.heightData[index + 1] + options.heightData[index + 2];

        options.vertices[verticesIndex].z = all / (20 * 6);
        verticesIndex++;
    }

    // Send to frondend.
    self.postMessage({
        eventKey,
        data: {
            vertices: options.vertices
        }
    });
}, false);