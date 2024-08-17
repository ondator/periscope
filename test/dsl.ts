//import { assert } from "chai";
import { Element, Link, Model, draw } from "index";


describe('DSL test', async ()=>{

    const a = new Element('name a', 'https://min.io/resources/img/footer/logo.svg');
    const b = new Element('name b', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGLvTEsIFVg4Xjq362dlIoNfqqNoh7sNhApg&s');
    const l = new Link(a,b,"uses");

    await draw(new Model().add(a,b,l))
});