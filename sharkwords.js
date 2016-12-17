const Sharkwords = Backbone.Model.extend({

  defaults: function () {
    return { used: "", numWrong: 0 };
  },

  guessedWord: function () {  // "app_e" for "apple"
    return _.map(this.get("answer"), l => this.get("used").includes(l) ? l : "_").join('');
  },

  handleGuess: function (letter) {
    this.set("used", this.get("used") + letter);

    if (!this.get("answer").includes(letter)) {
      this.set("numWrong", this.get("numWrong") + 1);
    }
  },
});

const SharkwordsView = Backbone.View.extend({
  template: Handlebars.compile($('#sharkwords-template').html()),
  model: new Sharkwords({ answer: randomWord() }),
  events: { "click .letters": "handleGuess" },
  el: '.sharkwords',

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  render: function () {
    const used = this.model.get("used");
    this.$el.html(this.template({
      numWrong: this.model.get("numWrong"),
      word: this.model.guessedWord(),
      btns: _.map("abcdefghijklmnopqrstuvwxyz", l => ({ ltr: l, used: used.includes(l) })),
    }));
  },

  handleGuess(e) {
    e.preventDefault();
    this.model.handleGuess(e.target.value);
  }
});

new SharkwordsView().render();