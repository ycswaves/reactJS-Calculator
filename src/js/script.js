import React from "react";
import ReactDOM from "react-dom";

const app = document.getElementById('app');

class Layout extends React.Component {
  constructor() {
    super();
    this.state = {display: 0, lastAns: null, getAnsClicked: false};
    this.operatorList = ['+','-','x','/'];
    this.buttonMap = [
      'AC', 'CE', '%',  '/',
       '7',  '8', '9',  'x',
       '4',  '5', '6',  '-',
       '1',  '2', '3',  '+',
       '.',  '0','Ans', '='
    ].map((val)=>{return <Button clickBtn={this.clickBtn.bind(this)} key={val} value={val} />});
  }

  isEndWithOperator(str) {
    return (this.operatorList.indexOf(str.slice(-1)) > -1);
  }

  isStartWithOperator(str) {
    return (this.operatorList.indexOf(str.substr(0,1)) > -1);
  }

  clickBtn(btnVal) {
    let {display, lastAns, getAnsClicked} = this.state;
    display = (display == 0 || getAnsClicked)? '' : display;
    switch (btnVal) {
      case '=':
        if (this.isEndWithOperator(display)) {
          break; //skip eval
        }

        let ans;
        const replacedStr = display.replace('x','*').replace('Ans', lastAns).replace('%','*0.01');
        if (this.isStartWithOperator(display)) {
          ans = eval(lastAns + replacedStr);
        } else {
          ans = eval(replacedStr);
        }
        
        if (ans != undefined) {
          this.setState({
            display: ans,
            lastAns: ans,
            getAnsClicked: true
          });
        }
          
        break;

      case '%':
        if (!isNaN(display.slice(-1)) && display != '') {
          this.setState({display: display + btnVal, getAnsClicked: false});
        }  
        break;

      case 'Ans':
        if (lastAns != null) {
          this.setState({display: display + btnVal, getAnsClicked: false});
        } 
        break; 

      case 'AC':
        this.setState({display: 0, lastAns: null, getAnsClicked: false});
        break;

      case 'CE':
        this.setState({display: display.substr(0, display.length - 1)}); 
        break; 

      case '+':
      case '-':
      case 'x':
      case '/':
        if (this.isEndWithOperator(display)) {
          //replace last operator
          this.setState({display: display.slice(0,-1) + btnVal, getAnsClicked: false});
          break;
        }
        if (display != '' || lastAns) {
          this.setState({display: display + btnVal, getAnsClicked: false});
        } 
        break; 

      default:
        this.setState({display: display + btnVal, getAnsClicked: false});
        break;  
    }
    
  }
  
  render() {
    return (
      <div class="panel panel-info">
        <div class="panel-heading"><Display value={this.state.display} /></div>
        <div class="panel-body">
          {this.buttonMap}
        </div>
      </div>
    )
  }
}

class Display extends React.Component {
  render() {
    return (<div id="display" className="well well-sm">{this.props.value}</div>)
  }
}

class Button extends React.Component {
  handleChange() {
    this.props.clickBtn(this.props.value);
  }

  render() {
    return (
      <span class="btn btn-primary btn-calculator" onClick={this.handleChange.bind(this)}>{this.props.value}</span>
    )
  }
}



ReactDOM.render(<Layout />, app);