import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

require("isomorphic-fetch");
const uuid = require("uuid");
import RecordAudio from "../components/recordAudio";
import Profile from "../components/profile";

const styles = theme => ({
  app: {
    textAlign: "center",
    padding: "10px"
  },
  title: {
    marginBottom: 4 * theme.spacing.unit
  }
});

class App extends Component {
  state = {
    section: "profile",
    country: "",
    city: "",
    age: ""
  };

  handleTextInput = field => event => {
    this.setState({
      [field]: event.target.value
    });
  };

  uploadAudio = (sentence, blob) => {
    let fd = new FormData();
    fd.append("audio", blob);
    fd.append("sentence", sentence);
    fd.append("country", this.state.country);
    fd.append("city", this.state.city);
    fd.append("age", this.state.age);
    fd.append("id", uuid.v4());
    fd.append("date", new Date().toUTCString());
    fetch("/submitBlob", {
      headers: { Accept: "application/json" },
      method: "POST",
      body: fd
    }).then(result => {
      console.log("fetch result:", result); // eslint-disable-line no-console
    });
  };

  sectionToDisplay = section => {
    switch (section) {
      case "profile":
        return (
          <Profile
            handleTextInput={this.handleTextInput}
            setSection={() => this.setState({ section: "recorder" })}
          />
        );
      case "recorder":
        return <RecordAudio uploadAudio={this.uploadAudio} />;
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.app}>
        <Typography variant="display1" className={classes.title}>
          Sentence Recorder
        </Typography>
        {this.sectionToDisplay(this.state.section)}
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
