class ControlPanel{

  constructor(title){
    this.name = title;
    this.elements = [];
  }

  createPanel(){
    createP(this.name);
  }

  refreshPanel(){

    for(let element of this.elements){
      element.p.html(element.text + element.slider.value());
    }

  }

  addSlider(name,text,min,max,def,step){
    this.elements.push(new Slider(name, text, min, max, def, step));
  }

  value(name){
    return this.sliders[cp.index(name)].slider.value()
  }

  index(name){
    let index;
    for (let index = 0; index < this.elements.length; index++){
      if (this.elements[index].name === name){
        return index;
      }
    }
    return -1;
  }
}

class Slider{
  constructor(name, text, min, max, def, step){
    this.name = name;
    this.text = text;
    this.p = createP(text);
    this.slider = createSlider(min,max,def,step);
  }
}
