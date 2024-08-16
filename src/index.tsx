import { dia, shapes } from '@joint/core';
import { DirectedGraph } from '@joint/layout-directed-graph';

const namespace = shapes;

const graph = new dia.Graph({}, { cellNamespace: namespace });

const lt_btn = document.getElementById('lt')
if (lt_btn) {
    lt_btn.onclick = function(){
        DirectedGraph.layout(graph, {
            nodeSep: 50,
            edgeSep: 80,
            marginX: 100,
            marginY: 50,
            rankDir: "TB"
        });
    }
}

const sv_btn = document.getElementById('sv')
if (sv_btn) {
    sv_btn.onclick = function(){
        let svg = document.querySelector('svg')
		// const elastic = svg.querySelector('rect.elastic')
		// const p = elastic.parentElement
		// p.removeChild(elastic)
		// const zoom = getZoom()
		// setZoom(1)
		// // inject metadata
		// const script = document.createElement('script')
		// script.setAttribute('type', 'application/json')
		// this.metadata.layout = this.exportLayout()
		// script.append('<![CDATA[' + escapeCdata(JSON.stringify(this.metadata, null, 2)) + ']]>')
		// svg.insertBefore(script, svg.firstChild)
		// // read the SVG
		// let src = svg.outerHTML
		// // restore all
		// svg.removeChild(script)
		// p.append(elastic)
		// setZoom(zoom)
		// return src.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"')
        if (!svg) return
        var file = new Blob([svg.outerHTML
                                    .replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"')
                                    .replace("&nbsp;", ' ')], {type: 'image/svg+xml'});
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = 'image.svg';
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

new dia.Paper({
    el: document.getElementById('root'),
    model: graph,
    //width: 800,
    //height: 800,
    background: { color: '#F5F5F5' },
    cellViewNamespace: namespace
});

const rect1 = new shapes.standard.Image
const i = require('../pic/dc.png')
const toDataURL = (url) => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }))
const img = await toDataURL(i.default)

rect1.attr('image/xlinkHref', img)
// rect1.position(25, 25);
rect1.resize(180, 50);
rect1.addTo(graph);

const rect2 = new shapes.standard.Rectangle();
// rect2.position(95, 225);
rect2.resize(180, 50);
rect2.addTo(graph);

rect1.attr('label', { text: 'Hello', fill: '#353535' });
rect2.attr('label', { text: 'World!', fill: '#353535' });

const link = new shapes.standard.Link();
link.source(rect1);
link.target(rect2);
link.addTo(graph);

link.appendLabel({
    attrs: {
        text: {
            text: 'соси писос!'
        }
    }
});
link.router('rightAngle');

// link.connector('straight', {  cornerType: 'line' });