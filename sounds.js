Sounds = {
    urls: {
        hurt: [
            'sounds/wav/hurt-01.wav',
            'sounds/wav/hurt-02.wav',
            'sounds/wav/hurt-03.wav'
        ],

        voices: [
            'sounds/wav/scary_voice_01.wav',
            'sounds/wav/scary_voice_02.wav',
            'sounds/wav/scary_voice_03.wav',
            'sounds/wav/scary_voice_04.wav',
            'sounds/wav/scary_voice_05.wav',
            'sounds/wav/scary_voice_06.wav'
        ]
    },

    playRandomVoice: function() {
        var urls = this.urls.voices;
        var soundIndex = Math.floor(Math.random()*urls.length);
        var sound = new Howl({
            urls: [urls[soundIndex]],
            volume: 0.3
        });

        sound.play();
    },

    playFootstep: _.throttle(function() {
        var sounds = [
            'sounds/wav/footstep_01.wav',
            'sounds/wav/footstep_02.wav',
        ];

        var soundIndex = Math.floor(Math.random()*sounds.length);
        var sound = new Howl({
            urls: [sounds[soundIndex]]
        }).play();
    }, 250),

    playHurtSound: function() {
        var urls = this.urls.hurt;
        var hurtSoundIndex = Math.floor(Math.random()*urls.length);
        var hurtSound = new Howl({
            urls: [urls[hurtSoundIndex]]
        });

        hurtSound.play();
    }
};