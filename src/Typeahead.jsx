import React from 'react';
import PropTypes from "prop-types";

class Typeahead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      backgroundColor: 'white',
      hideList: false,
    }

    this.list = [];

    this.filterColors = this.filterColors.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  // event listeners for tab, enter, escape, and click
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('mouseup', this.handleClick);
  }

  handleKeyDown(e) {
    let inputEle = document.getElementsByTagName("input")[0];
    let liColorsEle = document.getElementsByClassName("each-color");

    if (e.key === "Enter") {
      for (let i = 0; i < liColorsEle.length; i++) {
        let li = liColorsEle[i];
        if (document.activeElement === li) {
          this.setState({
            backgroundColor: li.getAttribute("id").toLowerCase(),
            input: li.getAttribute("id"),
          });
          document.getElementsByTagName("input")[0].focus();
          break;
        }
      }
    } else if (e.key === "Tab" && this.list.length) {
      if ( document.activeElement === inputEle && this.list.length) {
        setTimeout(() => liColorsEle[0].focus(), 1);
      }
    } else if (e.key === "Escape") {
      document.activeElement.blur();
      this.setState({ hideList: true });
    }
  }

  handleClickOutside() {
    let inputEle = document.getElementsByTagName("input")[0];
    let liColorsEle = Array.from(document.getElementsByClassName("each-color"));
    if (
      document.activeElement !== inputEle && 
      !liColorsEle.some(l => l === document.activeElement)
    ) {
      this.setState({ hideList: true });
    } 
  }
  
  handleClick() {
    let liColorsEle = Array.from(document.getElementsByClassName("each-color"))
    if (liColorsEle.some((l) => l === document.activeElement)) {
      for (let i = 0; i < liColorsEle.length; i++) {
        let li = liColorsEle[i];
        if (document.activeElement === li) {
          this.setState({
            backgroundColor: li.getAttribute("id").toLowerCase(),
            input: li.getAttribute("id"),
          });
          document.getElementsByTagName("input")[0].focus();
          break;
        }
      }
    }
  }

  update(field) {
    return e => (
      this.setState({ [field]: e.target.value })
    )
  }

  filterColors() {
    const { list } = this.props;
    const { input } = this.state;
    
    let colorsList = null, errorMsg = null;
    if (
      input.length > 0 &&
      input.split("").some((char) => char !== " ") &&
      !list.some((l) => l === input)
    ) {
      let search = input.toLowerCase();
      while (search.startsWith(" ")) {
        search = search.slice(1);
      }

      this.list = list.filter((l) => l.toLowerCase().startsWith(search));
      colorsList = this.list.map((l, i) => {
        let bold = l.slice(0, search.length);
        let normal = l.slice(search.length);
        return (
          <li key={i} className="each-color" tabIndex="0" id={l}>
            <span className="bold">{bold}</span>
            <span className="normal">{normal}</span>
          </li>
        );
      });

      if (!colorsList.length) {
        errorMsg = (
          <span className="error">
            Oops! Looks like there are no colors that start with those letters.
            Please try again.{" "}
          </span>
        );
      }
    }

    return [colorsList, errorMsg];
  }

  handleFocus() {
    if (document.getElementsByTagName("input")[0] === document.activeElement) {
      this.setState({ hideList: false });
    }
  }

  render() {
    const { input, backgroundColor, hideList } = this.state;
    const [colorsList, errorMsg] = this.filterColors();
   
    return (
      <section
        className="background"
        style={{ backgroundColor: backgroundColor }}
      >
        <div className="container">
          <div className="main">
            <span className="title">Welcome to Color Finder!</span>
            <div className="instructions">
              <span>Instructions</span>
              <span className="mouse">
                with mouse: click to select your color
              </span>
              <span className="keyboard">
                with keyboard: use <span>tab</span> and <span>shift+tab</span>
              </span>
              <span className="keyboard-row-2">
                use <span>enter</span> to select
              </span>
            </div>
            <input
              type="text"
              placeholder="Begin typing to find a color..."
              value={input}
              className={
                colorsList && colorsList.length && !hideList ? "show-list" : ""
              }
              onFocus={this.handleFocus}
              onChange={this.update("input")}
            />
            {colorsList && !hideList ? (
              <ul className="colors-list">{colorsList}</ul>
            ) : null}
            {errorMsg}
          </div>
        </div>
      </section>
    );
  }
}

Typeahead.propTypes = {
  list: PropTypes.array,
};

export default Typeahead;