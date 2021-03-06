jQuery(function($) {
    "use strict";
    
    // from: http://bl.ocks.org/mbostock/981b42034400e48ac637
    Edgesense.MitchellBestCandidateSampler = function (width, height, numCandidates, numSamplesMax) {
      var numSamples = 0;

      var quadtree = d3.geom.quadtree()
          .extent([[0, 0], [width, height]])
          ([[Math.random() * width, Math.random() * height]]);

      return function() {
        if (++numSamples > numSamplesMax) return;
        var bestCandidate, bestDistance = 0;
        for (var i = 0; i < numCandidates; ++i) {
          var c = [Math.random() * width, Math.random() * height],
              d = distance(search(c[0], c[1]), c);
          if (d > bestDistance) {
            bestDistance = d;
            bestCandidate = c;
          }
        }
        quadtree.add(bestCandidate);
        return bestCandidate;
      };

      function distance(a, b) {
        var dx = a[0] - b[0],
            dy = a[1] - b[1];
        return dx * dx + dy * dy;
      };

      // Find the closest node to the specified point.
      function search(x, y) {
        var x0 = 0,
            y0 = 0,
            x3 = width,
            y3 = width,
            minDistance2 = Infinity,
            closestPoint;

        (function find(node, x1, y1, x2, y2) {
          var point;

          // stop searching if this cell can’t contain a closer node
          if (x1 > x3 || y1 > y3 || x2 < x0 || y2 < y0) return;

          // visit this point
          if (point = node.point) {
            var dx = x - point[0],
                dy = y - point[1],
                distance2 = dx * dx + dy * dy;
            if (distance2 < minDistance2) {
              var distance = Math.sqrt(minDistance2 = distance2);
              x0 = x - distance, y0 = y - distance;
              x3 = x + distance, y3 = y + distance;
              closestPoint = point;
            }
          }

          // bisect the current node
          var children = node.nodes,
              xm = (x1 + x2) * .5,
              ym = (y1 + y2) * .5,
              right = x > xm,
              below = y > ym;

          // visit closest cell first
          if (node = children[below << 1 | right]) find(node, right ? xm : x1, below ? ym : y1, right ? x2 : xm, below ? y2 : ym);
          if (node = children[below << 1 | !right]) find(node, right ? x1 : xm, below ? ym : y1, right ? xm : x2, below ? y2 : ym);
          if (node = children[!below << 1 | right]) find(node, right ? xm : x1, below ? y1 : ym, right ? x2 : xm, below ? ym : y2);
          if (node = children[!below << 1 | !right]) find(node, right ? x1 : xm, below ? y1 : ym, right ? xm : x2, below ? ym : y2);
        })(quadtree, x0, y0, x3, y3);

        return closestPoint;
      }
    }
    
    // // Example usage
    // if (isolated_nodes) {
    //     var max_x = _.max(network_graph.graph.nodes(), function(n){ return n.x; }).x;
    //     var max_y = _.max(network_graph.graph.nodes(), function(n){ return n.y; }).y;
    //     var min_x = _.min(network_graph.graph.nodes(), function(n){ return n.x; }).x;
    //     var min_y = _.min(network_graph.graph.nodes(), function(n){ return n.y; }).y;
    //     var origin_x = Math.floor(max_x);
    //     var origin_y = Math.floor(max_y*0.50);
    //     var width = Math.floor(max_x*0.15);
    //     var height = Math.abs(Math.floor(max_y*0.5))
    //     var sampler = MitchellBestCandidateSampler(width, height, 15, 5000);
    //     var origin_x = Math.floor(min_x);
    //     var origin_y = Math.floor(max_y*1.03);
    //     var step = Math.floor(Math.abs(max_x-min_x)/isolated_nodes.length+2);
    //     var index = 1
    //     _.each(isolated_nodes, function(n){
    //         var node = nodes_map[n.id];
    //         var smpl = sampler();
    //         if (node) {
    //             node.x = n.x = Math.floor(origin_x+smpl[0]);
    //             node.y = n.y = origin_y+smpl[1];
    //             network_graph.graph.addNode(n);
    //             index += 1;
    //         }
    //     });
    //     network_graph.refresh();
    // }

});
