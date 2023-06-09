import Image from '../Image';
import classNames from 'classnames/bind';
import Button from '../Button';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import fileDownload from 'js-file-download';

import { Wrapper as PopperWrapper } from '~/components/Popper';
import styles from './VideoInfo.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faCode,
    faComment,
    faDownload,
    faHeart,
    faMusic,
    faShare,
} from '@fortawesome/free-solid-svg-icons';
import VideoItem from '../VideoItem';
import AccountPreview from '~/components/AccountPreview';
import { Link, useNavigate } from 'react-router-dom';
import { faFacebook, faInstagram, faTelegram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import Menu from '../Popper/Menu';
import { actions } from '~/store';

const cx = classNames.bind(styles);

function VideoInfo({ data, index }) {
    const state = useSelector((state) => state.reducer);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [videoInfo, setVideoInfo] = useState({
        ...data,
        follow_user: data.follow_user === 1,
        like_video: data.like_video === 1,
    });

    useEffect(() => {
        dispatch(
            actions.setLocationVideo({
                index: index,
                location:
                    viewRef.current.offsetTop + viewRef.current.offsetHeight - window.innerHeight,
            }),
        );
    }, [dispatch, index]);

    // Du lieu video khi nhap video vao
    useEffect(() => {
        setVideoInfo({
            ...data,
            follow_user: data.follow_user === 1,
            like_video: data.like_video === 1,
        });
    }, [data]);

    const viewRef = useRef(null);

    const shareMenu = [
        {
            icon: <FontAwesomeIcon icon={faCode} />,
            title: 'Embedded',
        },
        {
            icon: <FontAwesomeIcon icon={faFacebook} />,
            title: 'Share to Facebook',
            to: 'https://www.facebook.com/',
        },
        {
            icon: <FontAwesomeIcon icon={faInstagram} />,
            title: 'Share to Instagram',
            to: 'https://instagram.com/',
        },
        {
            icon: <FontAwesomeIcon icon={faTwitter} />,
            title: 'Share to Twitter',
            to: 'https://twitter.com/',
        },
        {
            icon: <FontAwesomeIcon icon={faTelegram} />,
            title: 'Share to Telegram',
            to: 'https://web.telegram.org/',
        },
    ];

    // tạo biến để xem xét một object có nằm trong viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) dispatch(actions.setCurrentIndex(index));
            },
            { threshold: 0, rootMargin: '-49.9% 0px -49.9% 0px ' },
        );

        observer.observe(viewRef.current);

        return () => {
            observer.disconnect();
        };
    }, [dispatch, index]);

    //Render tippy
    const renderPreview = (props) => {
        return (
            <div tabIndex="-1" {...props}>
                <PopperWrapper>
                    <AccountPreview data={data} />
                </PopperWrapper>
            </div>
        );
    };

    //handle follow
    const handleFollow = () => {
        if (state.currentLogin) {
            if (state.currentLogin) {
                if (videoInfo.follow_user) {
                    dispatch(actions.setUnFollow(videoInfo.id_user));
                } else {
                    dispatch(actions.setFollow(videoInfo.id_user));
                }
            }
        } else alert('Đăng nhập để sử dụng tính năng trên');
    };

    // handle comment
    const handleComment = () => {
        navigate(`/@${videoInfo.id_user}/video/${videoInfo.id_video}`);
        dispatch(actions.setCurrentIndex(index));
    };

    //handle like video
    const handleLikeVideo = () => {
        if (state.currentLogin) {
            if (videoInfo.like_video) {
                dispatch(
                    actions.setUnLike({ id_user: videoInfo.id_user, id_video: videoInfo.id_video }),
                );
            } else {
                dispatch(
                    actions.setLike({ id_user: videoInfo.id_user, id_video: videoInfo.id_video }),
                );
            }
        } else alert('Please login to like video');
    };

    //handle download video
    const handleDownload = () => {
        if (state.currentLogin) {
            axios
                .get(videoInfo.video_url, {
                    responseType: 'blob',
                })
                .then((res) => {
                    fileDownload(res.data, `${videoInfo.id_video}.mp4`);
                });
            dispatch(actions.setDownload(videoInfo.id_video));
        } else alert('Please login to download video');
    };

    //handle share video
    const handleShare = () => {
        if (state.currentLogin) {
            dispatch(actions.setShare(videoInfo.id_video));
        } else alert('Please login to share video');
    };

    return (
        <div className={cx('wrapper')} ref={viewRef}>
            <Image className={cx('avatar')} src={videoInfo.avatar} alt="avatar" />
            <div className={cx('content')}>
                <div className={cx('header')}>
                    <div className={cx('user')}>
                        <div>
                            <Tippy
                                interactive
                                delay={[800, 0]}
                                offset={[-20, 0]}
                                placement="bottom"
                                render={() => renderPreview()}
                                popperOptions={{ strategy: 'fixed' }}
                            >
                                <Link
                                    to={`/user/@${videoInfo.id_user}`}
                                    className={cx('user-nickname')}
                                >
                                    {videoInfo.nickname}
                                    {videoInfo.tick && (
                                        <FontAwesomeIcon
                                            className={cx('check')}
                                            icon={faCheckCircle}
                                        />
                                    )}
                                </Link>
                            </Tippy>
                        </div>
                        <div className={cx('user-fullname')}>{videoInfo.full_name}</div>
                    </div>

                    {/* Thông tin video */}
                    <div className={cx('desc')}>{videoInfo.description}</div>
                    <h4 className={cx('music')}>
                        <FontAwesomeIcon icon={faMusic} />
                        <div className={cx('music-name')}>{videoInfo.music}</div>
                    </h4>
                    {state.currentId === videoInfo.id_user ? null : (
                        <Button
                            outline={!videoInfo.follow_user}
                            primary={videoInfo.follow_user}
                            className={cx('follow-btn')}
                            onClick={handleFollow}
                        >
                            {videoInfo.follow_user ? ' Following' : 'Follow'}
                        </Button>
                    )}
                </div>

                {/* phần video */}
                <div className={cx('video-content')}>
                    <div className={cx('video')}>
                        <VideoItem data={videoInfo} index={index} />
                    </div>

                    {/* icon bên phải video */}
                    <div className={cx('video-icons')}>
                        <div className={cx('btn-item')}>
                            <span className={cx('icon-wrapper')} onClick={handleLikeVideo}>
                                <FontAwesomeIcon
                                    icon={faHeart}
                                    className={cx('icon', videoInfo.like_video ? 'like' : '')}
                                />
                            </span>
                            <span className={cx('text')}>{videoInfo.likes}</span>
                        </div>
                        <div className={cx('btn-item')}>
                            <span className={cx('icon-wrapper')}>
                                <FontAwesomeIcon
                                    icon={faComment}
                                    className={cx('icon')}
                                    onClick={handleComment}
                                />
                            </span>

                            <span className={cx('text')}>{videoInfo.comments}</span>
                        </div>

                        <div className={cx('btn-item')}>
                            <span className={cx('icon-wrapper')} onClick={handleDownload}>
                                <FontAwesomeIcon icon={faDownload} className={cx('icon')} />
                            </span>

                            <span className={cx('text')}>{videoInfo.download}</span>
                        </div>

                        <div className={cx('btn-item')}>
                            <Menu items={shareMenu} placement="right-start">
                                <span className={cx('icon-wrapper')} onClick={handleShare}>
                                    <FontAwesomeIcon icon={faShare} className={cx('icon')} />
                                </span>
                            </Menu>

                            <span className={cx('text')}>{videoInfo.share}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

VideoInfo.propTypes = {
    data: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

export default VideoInfo;
