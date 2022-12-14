package com.da_ta.backend.question.controller;

import com.da_ta.backend.account.jwt.JwtTokenProvider;
import com.da_ta.backend.common.domain.Message;
import com.da_ta.backend.question.controller.dto.AccuseAnswerRequest;
import com.da_ta.backend.question.controller.dto.CreateTodayAnswerRequest;
import com.da_ta.backend.question.controller.dto.TodayAnswerResponse;
import com.da_ta.backend.question.controller.dto.TodayQuestionResponse;
import com.da_ta.backend.question.service.TodayAnswerService;
import com.da_ta.backend.question.service.TodayQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/today")
public class QuestionController {

    private final TodayQuestionService questionService;
    private final TodayAnswerService answerService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/question")
    public ResponseEntity<TodayQuestionResponse> findQuestion() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(questionService.findTodayQuestion());
    }

    @PostMapping("/answer")
    public ResponseEntity<Message> createAnswer(@RequestHeader(AUTHORIZATION) String token,
                                                @RequestBody CreateTodayAnswerRequest createTodayAnswerRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(answerService.createTodayAnswer(createTodayAnswerRequest, jwtTokenProvider.findUserByToken(token)));
    }

    @GetMapping("/answer/{today_question_id}")
    public ResponseEntity<List<TodayAnswerResponse>> findAnswers(@PathVariable("today_question_id") Long todayQuestionId) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(answerService.findTodayAnswers(todayQuestionId));
    }

    @PostMapping("/answer/accusation/{today_answer_id}")
    public ResponseEntity<Message> accuseAnswer(@RequestHeader(AUTHORIZATION) String token,
                                                @PathVariable("today_answer_id") Long todayAnswerId,
                                                @RequestBody AccuseAnswerRequest accuseAnswerRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(answerService.createAnswerAccusation(jwtTokenProvider.findUserByToken(token), todayAnswerId, accuseAnswerRequest));
    }
}
