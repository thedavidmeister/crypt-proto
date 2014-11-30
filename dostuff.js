(function($, undefined) {
  "use strict";

  window.dostuff = {

    get bcrypt() {
      dcodeIO.bcrypt.setRandomFallback(_this().random);
      return dcodeIO.bcrypt;
    },

    random: function random() {
      return isaac.random();
    },

    hash: function hash(password) {
      var salt = _this().bcrypt.genSaltSync();
      return _this().bcrypt.hashSync(password, salt);
    },

    /**
     * Ready event handler.
     */
    ready: function ready(e) {
      console.log(_this().rand);
    }

  };

  function _this() {
    return window.dostuff;
  }

  $(_this().ready);

})(jQuery);
