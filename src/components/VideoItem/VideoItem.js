import classNames from 'classnames/bind';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay, faVolumeHigh, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import styles from './VideoItem.module.scss';
import { useEffect, useState } from 'react';
import { actions } from '~/store';

const cx = classNames.bind(styles);

function VideoItem({ data, index }) {
    const state = useSelector((state) => state.reducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isPlaying, setIsPlaying] = useState(state.currentIndex === index);

    const handlePlay = (e) => {
        e.stopPropagation();
        setIsPlaying(!isPlaying);
    };

    const handleClickOnVideo = () => {
        navigate(`/@${data.id_user}/video/${data.id_video}`);
        dispatch(actions.setCurrentIndex(index));
    };

    useEffect(() => {
        setIsPlaying(state.currentIndex === index);
    }, [state.currentIndex, index]);

    return (
        <div className={cx('wrapper')}>
            <ReactPlayer
                url={data.video_url}
                loop
                width="100%"
                height="calc(450px + ((100vw - 768px) / 1152) * 200)"
                muted={state.volume === '0'}
                playing={isPlaying}
                playsinline
            />

            <div className={cx('cover')} onClick={handleClickOnVideo}>
                <button className={cx('icon-play')} onClick={(e) => handlePlay(e)}>
                    {isPlaying ? (
                        <FontAwesomeIcon icon={faPause} />
                    ) : (
                        <FontAwesomeIcon icon={faPlay} />
                    )}
                </button>

                <div className={cx('sound-controls')} onClick={(e) => e.stopPropagation()}>
                    <input
                        value={state.volume}
                        className={cx('input-volume')}
                        type={'range'}
                        min="0"
                        max="100"
                        step="1"
                        onInput={(e) => {
                            dispatch(actions.setVolume(e.target.value));
                        }}
                    />
                </div>
                <button
                    className={cx('icon-sound')}
                    onClick={(e) => {
                        e.stopPropagation();
                        dispatch(actions.setVolume(state.volume === '0' ? '50' : '0'));
                    }}
                >
                    {state.volume === '0' ? (
                        <FontAwesomeIcon icon={faVolumeMute} />
                    ) : (
                        <FontAwesomeIcon icon={faVolumeHigh} />
                    )}
                </button>
            </div>
            {/* các nút tương tác video */}
        </div>
    );
}

export default VideoItem;

VideoItem.propTypes = {
    data: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};
