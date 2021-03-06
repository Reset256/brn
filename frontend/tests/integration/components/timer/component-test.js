import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | timer', function(hooks) {
  setupRenderingTest(hooks);

  test('has mm:ss format', async function(assert) {
    this.set('countedSeconds', 67);
    this.set('startTimer', function() {});
    await render(
      hbs`<Timer @countedSeconds={{this.countedSeconds}} @startTimer={{this.startTimer}}/>`,
    );

    assert.dom('[data-test-timer-display-value]').hasText('01:07');
  });

  test('continues with time from studying-timer', async function(assert) {
    this.set('studyingTimer', {
      countedSeconds: 94,
      pause() {},
      resume() {},
    });
    await render(
      hbs`<Timer @studyingTimer={{this.studyingTimer}} @paused={{true}}/>`,
    );

    assert.dom('[data-test-timer-display-value]').hasText('01:34');
  });
});
