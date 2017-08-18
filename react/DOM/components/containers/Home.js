import React from 'react';
import { Link } from 'react-router';
import Translate from 'react-translate-component';

/**
 * Application Home screen
 */
const Home = () => (
    <div className="page">
        <div className="page__header">
            <div className="ui container">
                <div className="ui one column vertically padded centered grid">
                    <div className="column center aligned">
                        <Link to="/" className="page__headerLogo main_img">
                            <img
                                src="/images/logo_belimo.png?v0.10"
                                width="200"
                                className="page__headerLogoImg main_img"
                                role="presentation"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        <div className="page__content">
            <div className="page__container">
                <div className="ui container">
                    <div className="ui two column centered vertically padded stackable grid ">
                        <div className="center aligned column">
                            <p className="home__desc">
                                <Translate content="label.app.slogan.retrofit" />
                            </p>
                            <Link to="/retrofit" className="massive ui primary button">
                                <img src="/images/btn_retro_img.png" width="150" alt="" />
                            </Link>
                        </div>
                        <div className="ui vertical divider"> OR </div>
                        <div className="center aligned column">
                            <p className="home__desc">
                                <Translate content="label.app.slogan.valvesizer" />
                            </p>
                            <Link to="/valve-sizer" className="massive ui primary button">
                                <img src="/images/btn_planer_img.png" width="150" alt="" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Home;
