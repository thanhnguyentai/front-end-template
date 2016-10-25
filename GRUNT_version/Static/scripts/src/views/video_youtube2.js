define(['jquery', 'underscore', 'backbone', 'base/modules/video_youtube_module', 'base/modules/utils'], function ($, _, backbone, videoModule, utils) {

    'use strict';

    function init(container, eventDispatcher, otherParams) {
        var backboneView = backboneInit(eventDispatcher, otherParams);
        return new backboneView({
            el: container
        });
    }

    function backboneInit(eventDispatcher, otherParams) {
        return Backbone.View.extend({
            enablePlayVideo: true,
            events: {
                'click [data-youtube-button]': 'startVideo'
            },

            initialize: function () {
                this.options = {
                    playerClass: 'player-video'
                };
                this.initVideo();
                if (this.youtubeParams.autoplay && otherParams.immediatePlay) {
                    this.startVideo();
                }
            },

            initVideo: function () {
                this.videoUrl = this.$('.vehicle-detail-video-play-button').attr('data-href');
                this.videoId = this.getYoutubeId(this.videoUrl);
                this.addVideoEvents();
                this.youtubeParams = utils.getUrlParams(this.videoUrl);
            },

            addVideoEvents: function () {
                this.listenTo(eventDispatcher, "playVideo", this.playVideo);
                this.listenTo(eventDispatcher, "pauseVideo", this.pauseVideo);
            },

            playVideo: function (eventData) {
                if (eventData.index == otherParams.index && eventData.url == otherParams.url) {
                    if (this.youtubeParams.autoplay) {
                        this.startVideo();
                        if (this.player) {
                            this.player.base.playVideo();
                        }
                    }
                }
            },

            pauseVideo: function (eventData) {
                if (eventData.index == otherParams.index && eventData.url == otherParams.url) {
                    if (this.player) {
                        this.player.base.pauseVideo();
                    }
                }
            },

            startVideo: function (evt) {
                if (!this.enablePlayVideo)
                    return;
                this.enablePlayVideo = false;

                videoModule.then(_.bind(this.loadVideo, this));
            },

            loadVideo: function (api) {
                this.$playerContainer = $('<div class="' + this.options.playerClass + '"></div>');
                this.$el.append(this.$playerContainer);
                var isVideoLoop = this.youtubeParams.loop;
                var playlist = '';
                if (isVideoLoop == 1) {
                    playlist = this.videoId
                }
                return api.create(this.$playerContainer.get(0), {
                    height: '100%',
                    width: '100%',
                    videoId: this.videoId,
                    params: _.extend(utils.getUrlParams(this.videoUrl), {
                        playlist: playlist,
                        autoplay: 1
                    })
                }, this.localDispatcher).then(_.bind(this.ready, this));
            },

            ready: function (player) {
                this.player = player;
            },

            removeVideo: function () {
                if (this.player) {
                    this.player.destroy();
                }
                this.$playerContainer.remove();
            },

            getYoutubeId: function (url) {

                var id = '';

                url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

                if (url[2] !== undefined) {
                    id = url[2].split(/[^0-9a-z_\-]/i);
                    id = id[0];
                }
                else {
                    id = url;
                }

                return id;
            }
        });
    }


    return {
        init: function (container, eventDispatcher, otherParams) {
            return init(container, eventDispatcher, otherParams);
        },
        isYoutubePlayer: true
    };
});
