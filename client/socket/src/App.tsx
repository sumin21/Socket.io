import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

import Auth from "./hoc/auth";
import Home from "./routes/Home";
import Login from "./routes/Login";
import NotFound from "./routes/NotFound";
import Rooms from "./routes/Rooms";
import SocketAuth from "./hoc/socketAuth";

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Dongle:wght@300&display=swap');
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
* {
  margin: 0;
}
a{
  text-decoration:none !important;
}
.btn-primary {
    color: #fff;
    background-color: #e47d7d;
    border-color: #e47d7d;
}


.dropdown-toggle{
  width: 100%;
  background-color: #e47d7d;
  border: 0;
}
.show>.btn-primary.dropdown-toggle {
    color: #fff;
    background-color: #e59999;
    border-color: #e59999;
}
.btn-primary:focus {
    color: #fff;
    background-color: #e59999;
    border-color: #e59999;
    box-shadow: 0 0 0 0.25rem #e47d7d;
}
.btn-primary:hover {
    color: #fff;
    background-color: #e59999;
    border-color: #e59999;
    box-shadow: 0 0 0 0.25rem #e47d7d;
}
.dropdown-menu{
  max-height: 150px;
  overflow-y: scroll;
}

.show>.btn-primary.dropdown-toggle:focus {
    box-shadow: 0 0 0 0.25rem #e47d7d;
}
`;

const LoginCss = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 4.2rem;
  padding-bottom: 4.2rem;
  background-repeat: no-repeat;
  background-size: cover;
`;

const LoginMargin = styled.div`
  margin-top: 4.2rem;
  max-width: 500px;
`;

const MyForm = styled.div`
  position: relative;
  display: -ms-flexbox;
  display: flex;
  padding: 3rem;
  -ms-flex-direction: column;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  outline: 0;
  /* max-width: 600px; */
  min-width: 300px;
  background-color: #e59999;
  text-align: center;
`;

const ChatTitle = styled.h1`
  font-weight: 900;
  color: white;
  margin-bottom: 2rem;
`;

const App: React.FC = () => {
  const newLoginPage = Auth(Login, false);
  const newRoomsPage = Auth(Rooms, true);
  const newHomePage = SocketAuth(Home);

  return (
    <>
      <GlobalStyle />
      <LoginCss>
        <LoginMargin className="container">
          <div className="row">
            <div>
              <MyForm className="form">
                <ChatTitle>Socket Chat</ChatTitle>
                <Switch>
                  <Route exact path="/room" component={newHomePage} />
                  <Route exact path="/login" component={newLoginPage} />
                  <Route exact path="/" component={newRoomsPage} />
                  <Route path="*" component={NotFound} />
                </Switch>
              </MyForm>
            </div>
          </div>
        </LoginMargin>
      </LoginCss>
    </>
  );
};

export default App;
