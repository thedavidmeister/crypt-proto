(function($, undefined) {
  "use strict";

  window.dostuff = {

    get bcrypt() {
      dcodeIO.bcrypt.setRandomFallback(_this().random);
      return dcodeIO.bcrypt;
    },

    get salt() {
      return _this().bcrypt.genSaltSync();
    },

    get randomFallback() {
      return isaac.random;
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

      console.log(user);
    }

  };

  function _this() {
    return window.dostuff;
  }

  $(_this().createUser({
    id: 'thedavidmeister',
    email: 'foo@example.com',
    secrets: ['one', 'two', 'three']
  }));

})(jQuery);
