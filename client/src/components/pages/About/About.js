// package
import React, { Component, Fragment } from 'react';
import { Accordion } from 'semantic-ui-react';

// css
import classes from './About.module.css';

class About extends Component {
  render() {
    const panels = [
      {
        key: 'weird',
        title: {
          content: (
            <span className={classes.itemTitle}>
              What is <em>weird fiction</em>?
            </span>
          )
        },
        content: {
          content: (
            <Fragment>
              <h4>
                From{' '}
                <a
                  className="header"
                  href="https://en.wikipedia.org/wiki/Weird_fiction"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wikipedia
                </a>
                :
              </h4>
              <div className="ui message">
                <p className={classes.itemDescription} style={{ marginBottom: '1rem' }}>
                  Weird fiction is a subgenre of speculative fiction originating in the late 19th
                  and early 20th centuries. John Clute defines Weird Fiction as a "Term used loosely
                  to describe Fantasy, Supernatural Fiction and Horror tales embodying transgressive
                  material". China Miéville defines Weird Fiction thus: "Weird Fiction is usually,
                  roughly, conceived of as a rather breathless and generically slippery macabre
                  fiction, a dark fantastic ("horror" plus "fantasy") often featuring nontraditional
                  alien monsters (thus plus “science fiction”)." Discussing the "Old Weird Fiction"
                  published in the late 19th and early 20th centuries, Jeffrey Andrew Weinstock says
                  "Old Weird fiction utilises elements of horror, science fiction and fantasy to
                  showcase the impotence and insignificance of human beings within a much larger
                  universe populated by often malign powers and forces that greatly exceed the human
                  capacities to understand or control them." Weird fiction either eschews or
                  radically reinterprets ghosts, vampires, werewolves and other traditional
                  antagonists of supernatural horror fiction.
                </p>
                <p className={classes.itemDescription}>
                  Weird fiction is sometimes symbolised by the tentacle, a limb-type absent from
                  most of the monsters of European folklore and gothic fiction, but often attached
                  to the monstrous creatures created by weird fiction writers such as William Hope
                  Hodgson, M. R. James and H. P. Lovecraft. Although "weird fiction" has been
                  chiefly used as a historical description for works through the 1930s, the term has
                  also been increasingly used since the 1980s, sometimes to describe slipstream
                  fiction that blends horror, fantasy, and science fiction.
                </p>
              </div>
            </Fragment>
          )
        }
      },
      {
        key: 'new-weird',
        title: {
          content: (
            <span className={classes.itemTitle}>
              What is <em>new weird</em>?
            </span>
          )
        },
        content: {
          content: (
            <Fragment>
              <h4>
                From{' '}
                <a
                  className="header"
                  href="https://en.wikipedia.org/wiki/New_weird"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wikipedia
                </a>
                :
              </h4>
              <div className="ui message">
                <p className={classes.itemDescription}>
                  The new weird is a literary genre that began in the 1990s and developed in a
                  series of novels and stories published from 2001 to 2005. M. John Harrison is
                  credited with creating the term "New Weird" in the introduction to China
                  Miéville's novella <em>The Tain</em> (2002). The writers involved are mostly
                  novelists who are considered to be parts of the horror or speculative fiction
                  genres but who often cross genre boundaries. Notable authors include K. J. Bishop,
                  Steve Cockayne, Paul Di Filippo, M. John Harrison, Thomas Ligotti, Ian R. MacLeod,
                  China Miéville, Alastair Reynolds, Justina Robson, Steph Swainston, and Jeff
                  VanderMeer, among others.
                </p>
              </div>
            </Fragment>
          )
        }
      },
      {
        key: 'resources',
        title: {
          content: (
            <span className={classes.itemTitle}>What are some good weird fiction resources?</span>
          )
        },
        content: {
          content: (
            <div className="ui list">
              <div className="item">
                <a
                  className="header"
                  href="https://www.reddit.com/r/WeirdLit/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WeirdLit Subreddit
                </a>
                <div className="description">
                  For news on weird fiction, collectibles, and book discussion (no affiliation).
                </div>
              </div>
              <div className="item">
                <a
                  className="header"
                  href="https://www.goodreads.com/shelf/show/weird-lit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Weird literature on Goodreads
                </a>
                <div className="description">A long list of popular weird lit books.</div>
              </div>
              <div className="item">
                <a
                  className="header"
                  href="http://weirdfictionreview.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Weird Fiction Review
                </a>
                <div className="description">
                  For articles and posts relating to weird fiction, created by Jeff and Ann
                  VanderMeer.
                </div>
              </div>
              <div className="item">
                <a
                  className="header"
                  href="https://lithub.com/weird-fiction-a-primer/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Literary Hub's <em>Weird Fiction: A Primer</em>
                </a>
                <div className="description">
                  A good article for a more thorough introduction on weird fiction.
                </div>
              </div>
              <div className="item">
                <a
                  className="header"
                  href="https://bookriot.com/2017/10/19/new-weird-genre/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Riot's <em>A Beginner's Guide to the New Weird Genre</em>
                </a>
                <div className="description">
                  Article with an introduction and recommendations for New Weird books.
                </div>
              </div>
            </div>
          )
        }
      },
      {
        key: 'info',
        title: {
          content: <span className={classes.itemTitle}>Who made this?</span>
        },
        content: {
          content: (
            <Fragment>
              <p className={classes.itemDescription} style={{ marginBottom: '1rem' }}>
                This website was created by James Thomas Davey.
              </p>
              <p className={classes.itemDescription}>
                If you have any suggestions, or if you would like to become an admin, please email
                me at <a href="mailto:weirdlitinfo@gmail.com">weirdlitinfo@gmail.com</a>.
              </p>
            </Fragment>
          )
        }
      }
    ];
    return (
      <div className="ui text container">
        <div className="ui segment">
          <h3 style={{ paddingBottom: '1.2rem' }}>About</h3>
          <Accordion defaultActiveIndex={0} panels={panels} styled fluid />
        </div>
      </div>
    );
  }
}

export default About;
