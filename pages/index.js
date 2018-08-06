import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
// import Typography from "@material-ui/core/Typography";

require("isomorphic-fetch");
const uuid = require("uuid");
import RecordAudio from "../components/recordAudio";
import Profile from "../components/profile";
import Finished from "../components/finished";

const styles = theme => ({
  app: {
    textAlign: "center",
    padding: "10px",
    maxWidth: "700px"
  },
  title: {
    marginBottom: 4 * theme.spacing.unit
  }
});

class App extends Component {
  state = {
    id: uuid.v4(),
    section: "finished",
    country: "",
    city: "",
    age: "",
    email: ""
  };

  handleTextInput = field => event => {
    this.setState({
      [field]: event.target.value
    });
  };

  uploadAudio = (sentence, sentenceIndex, blob) => {
    let fd = new FormData();
    fd.append("audio", blob);
    fd.append("sentence", sentence);
    fd.append("sentenceIndex", sentenceIndex);
    fd.append("country", this.state.country);
    fd.append("city", this.state.city);
    fd.append("age", this.state.age);
    fd.append("id", this.state.id);
    fd.append("date", new Date().toUTCString());
    fetch("/submitBlob", {
      headers: { Accept: "application/json" },
      method: "POST",
      body: fd
    }).then(result => {
      console.log("audio fetch result:", result); // eslint-disable-line no-console
    });
  };

  uploadEmail = email => {
    console.log("uploading email", email);

    let fd = new FormData();
    fd.append("id", this.state.id);
    fd.append("audio", null);
    fd.append("email", email);
    fetch("/submitBlob", {
      headers: { Accept: "application/json" },
      method: "POST",
      body: fd
    }).then(result => {
      console.log("email fetch result:", result); // eslint-disable-line no-console
    });
  };

  sectionToDisplay = section => {
    switch (section) {
      case "profile":
        return (
          <Profile
            nextSection={() => this.setState({ section: "recorder" })}
            handleTextInput={this.handleTextInput}
          />
        );
      case "recorder":
        return (
          <RecordAudio
            nextSection={() => this.setState({ section: "finished" })}
            uploadAudio={this.uploadAudio}
          />
        );
      case "finished":
        return <Finished uploadEmail={this.uploadEmail} />;
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.app}>
        {/*<Typography variant="display1" className={classes.title}>*/}
        {/*Sentence Recorder*/}
        {/*</Typography>*/}
        {this.sectionToDisplay(this.state.section)}
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
