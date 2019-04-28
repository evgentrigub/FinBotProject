import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Question } from '../Models/Questions';
import { TaskService } from '../services/task.service';
import { MatRadioChange } from '@angular/material';
import { Answers } from '../Models/Answers';

@Component({
  selector: 'app-test-for-level-risk',
  templateUrl: './test-for-level-risk.component.html',
  styleUrls: ['./test-for-level-risk.component.css']
})
export class TestForLevelRiskComponent implements OnInit {

  questionsAnswers: Question[];
  rating = 0;
  selection: Answers;

  readonly formGroup: FormGroup;
  readonly questionsControl: FormArray;

  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder
  ) {
    this.questionsControl = this.formBuilder.array([]);
    this.formGroup = this.formBuilder.group({
      questions: this.questionsControl
    });
   }

  ngOnInit() {
    this.getQuestions();
  }

  getQuestions() {
    this.taskService.getQuestionsList().subscribe((results: Question[]) => {

      while (this.questionsControl.length !== 0) {
        this.questionsControl.removeAt(0);
      }

      this.formGroup.reset();
      if (!results) {
        this.questionsAnswers = [];
        return;
      }
      this.questionsAnswers = results;

      results
      .map(res => this.createFormGroupQuestion(res))
      .forEach(el => {
        this.questionsControl.push(el);
      });
    });
  }

  createFormGroupQuestion(question: Question): FormGroup {
    return this.formBuilder.group({
      question: this.formBuilder.control(question.objContent),
      answers: this.formBuilder.control(question.answers),
      answer: this.formBuilder.control('', [Validators.required])
    });
  }

  /**
   * преобразует полученный результат в процент
   * и отправляет его в статистику пользователя на бек
   */
  submit() {
    if (this.formGroup.valid) {console.log('form is valid'); }

  }
}
