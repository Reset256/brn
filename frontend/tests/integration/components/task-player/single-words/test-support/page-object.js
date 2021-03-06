import {
  create,
  collection,
  attribute,
  isVisible,
} from 'ember-cli-page-object';

const page = create({
  options: collection('[data-test-task-answer]', {
    optionValue: attribute('data-test-task-answer-option'),
  }),
  hasRightAnswer: isVisible('[data-test-right-answer-notification]'),
});

export default page;
