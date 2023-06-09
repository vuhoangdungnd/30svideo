import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBookmark,
    faCircleQuestion,
    faCoins,
    faEarthAsia,
    faEllipsisVertical,
    faGear,
    faKeyboard,
    faMoon,
    faPlus,
    faSignOut,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import * as showService from '~/services/showService';
import config from '~/config';
import Button from '~/components/Button';
import styles from './Header.module.scss';
import images from '~/assets/images';
import Menu from '~/components/Popper/Menu';
import { InboxIcon, MessageIcon, UploadIcon } from '~/components/Icons';
import Image from '~/components/Image';
import Search from '../Search';
import { actions } from '~/store';

const cx = classNames.bind(styles);

const MENU_ITEMS = [
    {
        icon: <FontAwesomeIcon icon={faEarthAsia} />,
        title: 'English',
        children: {
            title: 'Language',
            data: [
                {
                    type: 'language',
                    code: 'en',
                    title: 'English',
                },
                {
                    type: 'language',
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    type: 'language',
                    code: 'en',
                    title: 'العربية',
                },
                {
                    type: 'language',
                    code: 'en',
                    title: 'Español',
                },
                {
                    type: 'language',
                    code: 'vi',
                    title: 'Suomi (Suomi)',
                },
                {
                    type: 'language',
                    code: 'en',
                    title: 'Filipino (Pilipinas)',
                },
                {
                    type: 'language',
                    code: 'vi',
                    title: 'Français',
                },
                {
                    type: 'language',
                    code: 'en',
                    title: 'עברית (ישראל)',
                },
                {
                    type: 'language',
                    code: 'vi',
                    title: 'हिंदी',
                },
                {
                    type: 'language',
                    code: 'en',
                    title: 'Magyar (Magyarország)',
                },
            ],
        },
    },
    {
        icon: <FontAwesomeIcon icon={faCircleQuestion} />,
        title: 'Feedback and help',
        to: '/feedback',
    },
    {
        icon: <FontAwesomeIcon icon={faKeyboard} />,
        title: 'Keyboard shortcuts',
    },
    {
        icon: <FontAwesomeIcon icon={faMoon} />,
        title: 'Dark mode',
    },
];
function Header() {
    const [myState, setMyState] = useState();
    const dispatch = useDispatch();
    const state = useSelector((state) => state.reducer);
    const navigate = useNavigate();

    //lấy dữ liệu ở nếu khi token ở local thay đổi

    useEffect(() => {
        if (state.token) {
            const fetchApi = async () => {
                dispatch(actions.setLoading(true));
                const res = await showService.showMyUser(state.token);
                setMyState(res.data.data);
                dispatch(actions.setLogin(res.data.data ? true : false));
                dispatch(actions.setLoading(false));
            };
            fetchApi();
        } else {
            setMyState();
        }
    }, [state.token, dispatch]);

    const handleMenuChange = (menuItem) => {
        switch (menuItem.title) {
            case 'Log out':
                localStorage.removeItem('user');
                dispatch(actions.setToken({ token: null, exp: null, currentId: null }));
                dispatch(actions.setLogin(false));
                dispatch(actions.clearVideoList());
                break;
            default:
        }
    };

    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'View profile',
            to: myState ? `/user/@${myState.id_user}` : null,
        },
        {
            icon: <FontAwesomeIcon icon={faBookmark} />,
            title: 'Favorites',
        },
        {
            icon: <FontAwesomeIcon icon={faCoins} />,
            title: 'Get coins',
            to: '/coin',
        },
        {
            icon: <FontAwesomeIcon icon={faGear} />,
            title: 'Settings',
            to: '/settings',
        },
        ...MENU_ITEMS,
        {
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Log out',
            separate: true,
        },
    ];

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link to={config.routes.home} className={cx('logo-link')}>
                    <img src={images.logo} alt="30sVideo" />
                </Link>
                <Search />
                <div className={cx('actions')}>
                    {myState ? (
                        <>
                            <Tippy delay={[0, 50]} content="Upload video" placement="bottom">
                                <button
                                    className={cx('action-btn')}
                                    onClick={() => navigate(config.routes.upload)}
                                >
                                    <UploadIcon />
                                </button>
                            </Tippy>
                            <Tippy delay={[0, 50]} content="Message" placement="bottom">
                                <button className={cx('action-btn')}>
                                    <MessageIcon />
                                </button>
                            </Tippy>
                            <Tippy delay={[0, 50]} content="Inbox" placement="bottom">
                                <button className={cx('action-btn')}>
                                    <InboxIcon />
                                    <span className={cx('badge')}>99</span>
                                </button>
                            </Tippy>
                        </>
                    ) : (
                        <>
                            <Button
                                text
                                outline
                                leftIcon={<FontAwesomeIcon icon={faPlus} />}
                                onClick={() => alert('Please login before uploading your video')}
                            >
                                Upload
                            </Button>

                            <Button primary to={config.routes.login}>
                                Log in
                            </Button>
                        </>
                    )}

                    <Menu items={myState ? userMenu : MENU_ITEMS} onChange={handleMenuChange}>
                        {myState ? (
                            <Image
                                className={cx('user-avatar')}
                                src={myState.avatar}
                                alt={myState.id_user}
                            />
                        ) : (
                            <button className={cx('more-btn')}>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                        )}
                    </Menu>
                </div>
            </div>
        </header>
    );
}

export default Header;
