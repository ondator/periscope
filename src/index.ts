import { dia, shapes } from '@joint/core';
import { DirectedGraph } from '@joint/layout-directed-graph';


class Element {
    name?: string = undefined;
    image: string = "";

    constructor(label: string, image: string) {
        this.name = label;
        this.image = image
    }
}

class Link {
    from: Element;
    to: Element;
    label: string | null;

    constructor(from: Element, to: Element, label: string | null) {
        this.from = from;
        this.to = to;
        this.label = label
    }
}

class Model {
    cellsMap: Map<Element | Link, dia.Cell<any, any>> = new Map<Element | Link, dia.Cell<any, any>>();

    add(...args: (Element | Link)[]): Model {

        for (let e of args) {
            switch (e.constructor) {
                case Element:
                    this.addElement(<Element>e)
                case Link:
                    this.addLink(<Link>e)
                default:
                    throw new TypeError("unknown model element");
            }
        }

        return this
    }

    addLink(link: Link) {
        const dlink = this.createLink(link)
        this.cellsMap.set(link, dlink)
    }

    createLink(l: Link): shapes.standard.Link {
        const link = new shapes.standard.Link();
        const from = this.cellsMap.get(l.from);
        const to = this.cellsMap.get(l.to);
        if (from && to) {
            link.source(from);
            link.target(to);
        }

        if (l.label)
            link.appendLabel({
                attrs: {
                    text: {
                        text: l.label
                    }
                }
            });
        link.router('rightAngle');
        return link;
    }

    async addElement(elem: Element) {
        const delem = await this.createElement(elem)
        this.cellsMap.set(elem, delem)
    }

    async createElement(e: Element): Promise<shapes.standard.Image> {
        const elem = new shapes.standard.Image
        const i = require(`${e.image}`)                
        const toDataURL = (url: any) => fetch(url)
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
            }))
        const img = await toDataURL(i.default)

        elem.attr('image/xlinkHref', img)
        if (e.name) elem.attr('label/text', e.name);
        elem.resize(180, 50);
        return elem;
    }
}

async function draw(m: Model) {
    const namespace = shapes;

    const graph = new dia.Graph({}, { cellNamespace: namespace });

    const lt_btn = document.getElementById('lt')
    if (lt_btn) {
        lt_btn.onclick = function () {
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
        sv_btn.onclick = function () {
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
                .replace("&nbsp;", ' ')], { type: 'image/svg+xml' });
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = 'image.svg';
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    new dia.Paper({
        el: document.getElementById('root'),
        model: graph,        
        background: { color: '#F5F5F5' },
        cellViewNamespace: namespace
    });

    const cells = Array.from(m.cellsMap.values())
    graph.addCells(cells)

    // link.connector('straight', {  cornerType: 'line' });
}
export { Element, Link, Model, draw };