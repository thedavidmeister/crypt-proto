(function($, undefined) {
  "use strict";

  window.dostuff = {

    get bcrypt() {
      dcodeIO.bcrypt.setRandomFallback(_this().randomFallback);
      return dcodeIO.bcrypt;
    },

    get apiURL() {
      return 'http://vagrant.ld';
    },

    randomFallback: function randomFallback(len) {
      return _this().random(len);
    },

    randomBytes: function randomBytes(len) {
      return _this().api('random', len);
    },

    get seedLen() {
      return 512;
    },

    get saltRounds() {
      return 10;
    },

    get seed() {
      return this._seed;
    },

    get prng() {
      return window.isaac;
    },

    set seed(s) {
      if (s.length < this.seedLen) {
        throw 'Seed length less than ' + this.seedLen;
      }

      this._seed = s;
      console.log(this);
    },

    hash: function hash(password) {
      return _this().bcrypt.hashSync(password, _this().salt);
    },

    compare: function compare(password, hash) {
      return _this().bcrypt.compareSync(password, hash);
    },

    createUser: function createUser(user) {
      var i;
      for (i in user.secrets) {
        user.secrets[i] = _this().hash(user.secrets[i]);
      }
      _this().randomBytes(10);
      console.log(user);
    },

    prngSeed: function prngSeed() {
      return $.Deferred(function ( d ) {
        $.get(_this().apiURL + '/random/' + _this().seedLen, {}, function() {
          _this().seed = arguments[0];

          // Seed ISAAC with the random bytes collected.
          _this().prng.seed(_this().seed);

          // Run a random number once before use.
          _this().prng.random();

          d.resolve();
        });
      }).promise();
    },

    genSalt: function genSalt() {
      return $.Deferred(function ( d ) {
        _this().bcrypt.genSalt(_this().saltRounds, function(err, salt) {
          _this().salt = salt;

          d.resolve();
        });
      }).promise();
    },

    init: function init(callback) {
      if (init.started) {
        throw 'init() called twice.';
      }
      init.started = true;
      $.when(_this().prngSeed()).done(function () {
        $.when(_this().genSalt()).done(function() {
          _this().safe = true;
          callback();
        });
      });
    }

  };

  function _this() {
    return window.dostuff;
  }

  $(_this().init());

  // $(_this().createUser({
  //   id: 'thedavidmeister',
  //   email: 'foo@example.com',
  //   secrets: ['one', 'two', 'three']
  // }));

})(jQuery);
