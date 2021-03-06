import { module, test } from 'qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupApplicationTest } from 'ember-qunit';
import pageObject from './test-support/page-object';
import {
  getServerResponses,
  chooseAnswer,
  setupAfterPageVisit,
} from './test-support/helpers';
import { settled } from '@ember/test-helpers';
import AudioPlayer from 'brn/components/audio-player/component';
import customTimeout from 'brn/utils/custom-timeout';

AudioPlayer.reopen({
  async playAudio() {},
});

module('Acceptance | tasks flow', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('shows regret widget if answer is wrong and a word image if right', async function(assert) {
    getServerResponses();

    await pageObject.goToFirstTask();

    const { targetTask, wrongAnswer } = setupAfterPageVisit();

    chooseAnswer(wrongAnswer.word);

    await customTimeout();

    assert
      .dom('[data-test-answer-correctness-widget]')
      .hasAttribute('data-test-isnt-correct');

    await settled();

    chooseAnswer(targetTask.correctAnswer.word);

    await customTimeout();

    assert.dom('[data-test-right-answer-notification]').exists();
  });

  test('goest to next task after a right answer picture', async function(assert) {
    getServerResponses();

    await pageObject.goToFirstTask();

    const { targetTask } = setupAfterPageVisit();

    chooseAnswer(targetTask.correctAnswer.word);

    await customTimeout();

    assert.dom('[data-test-right-answer-notification]').exists();

    await customTimeout();

    assert.dom('[data-test-task-id="2"]').exists();
  });

  test('sends a POST request to "study-history" after exercise completed', async function(assert) {
    assert.expect(3);

    getServerResponses();
    /* eslint-disable no-undef */
    server.post('/study-history', function(request) {
      assert.ok(true, 'sends a post request');
      return { id: 1, ...JSON.parse(request.requestBody) };
    });

    await pageObject.goToFirstTaskSecondExercise();

    let { targetTask } = setupAfterPageVisit();

    chooseAnswer(targetTask.correctAnswer.word);

    await customTimeout();

    assert.dom('[data-test-right-answer-notification]').exists();

    await customTimeout();

    const targetTask2 = setupAfterPageVisit().targetTask;

    await customTimeout();

    chooseAnswer(targetTask2.correctAnswer.word);

    await customTimeout();
    await customTimeout();

    assert
      .dom('[data-test-answer-correctness-widget]')
      .hasAttribute('data-test-is-correct');
  });

  test('shows a complete victory widget after exercise completed', async function(assert) {
    getServerResponses();
    /* eslint-disable no-undef */
    server.put('exercises/1', function() {});

    await pageObject.goToFirstTask();

    let { targetTask } = setupAfterPageVisit();

    chooseAnswer(targetTask.correctAnswer.word);

    await customTimeout();

    assert.dom('[data-test-right-answer-notification]').exists();

    await customTimeout();

    assert.dom('[data-test-task-id="2"]').exists();

    const targetTask2 = setupAfterPageVisit().targetTask;

    await customTimeout();

    chooseAnswer(targetTask2.correctAnswer.word);

    await customTimeout();

    assert.dom('[data-test-right-answer-notification]').exists();

    await customTimeout();

    assert
      .dom('[data-test-answer-correctness-widget]')
      .hasAttribute('data-test-is-correct');

    await customTimeout();
    await customTimeout();

    assert
      .dom('[data-test-task-id="3"]')
      .hasAttribute('data-test-task-exercise-id', '2');
  });
});
