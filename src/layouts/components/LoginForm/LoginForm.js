import classNames from 'classnames/bind';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import * as loginService from '~/services/loginService';
import Button from '~/components/Button';
import config from '~/config';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './LoginForm.module.scss';
import {
    faFacebook,
    faGithub,
    faGoogle,
    faInstagram,
    faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { actions } from '~/store';

const cx = classNames.bind(styles);

function LoginForm() {
    const [data, setData] = useState({
        username: '',
        password: '',
    });

    const dispatch = useDispatch();
    const state = useSelector((state) => state.reducer);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const userData = {
            username: data.username,
            password: data.password,
        };

        const fetchApi = async () => {
            const res = await loginService.login(userData);
            if (res.data.token === null) alert(res.data.message);
            else {
                dispatch(
                    actions.setToken({
                        token: res.data.token,
                        exp: res.data.exp,
                        currentId: res.data.id_user,
                    }),
                );
                dispatch(actions.setLogin(true));
                dispatch(actions.clearVideoList());
                localStorage.setItem(
                    'user',
                    JSON.stringify({
                        token: res.data.token,
                        theme: state.theme,
                        exp: res.data.exp,
                        currentId: res.data.id_user,
                    }),
                );
                navigate(config.routes.home);
                alert(res.data.message);
            }
        };

        fetchApi();
    };

    const handleChange = (e) => {
        const value = e.target.value;

        setData({
            ...data,
            [e.target.name]: value,
        });
    };
    return (
        <div className={cx('wrapper')}>
            <div>
                <Button
                    primary
                    leftIcon={<FontAwesomeIcon icon={faArrowAltCircleLeft} />}
                    className={cx('btn-back')}
                    to={config.routes.home}
                >
                    Back to home
                </Button>
            </div>
            <div className={cx('login-box')}>
                <p className={cx('title')}>Login</p>

                <form onSubmit={handleLogin}>
                    <div className={cx('user-box')}>
                        <input
                            type="text"
                            name="username"
                            required
                            value={data.username}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                        <label>Username</label>
                    </div>

                    <div className={cx('user-box')}>
                        <input
                            type="password"
                            name="password"
                            required
                            value={data.password}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                        <label>Password</label>
                    </div>

                    <div className={cx('forgot')}>
                        <a href="/"> Forgot Password?</a>
                    </div>

                    <Button type="submit" primary className={cx('btn')}>
                        Sign in
                    </Button>
                </form>

                <div className={cx('social-message')}>
                    <div className={cx('line')}></div>
                    <p className={cx('message')}> Login with social accounts</p>
                    <div className={cx('line')}></div>
                </div>

                <div className={cx('social-icons')}>
                    <FontAwesomeIcon icon={faFacebook} className={cx('icon')} />
                    <FontAwesomeIcon icon={faTwitter} className={cx('icon')} />
                    <FontAwesomeIcon icon={faGoogle} className={cx('icon')} />
                    <FontAwesomeIcon icon={faGithub} className={cx('icon')} />
                    <FontAwesomeIcon icon={faInstagram} className={cx('icon')} />
                </div>

                <p className={cx('signup')}>
                    {' '}
                    Don't have an account?
                    <Link to={config.routes.register} className={cx('btn-signup')}>
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginForm;
