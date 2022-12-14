package com.da_ta.backend.question.domain.repository;

import com.da_ta.backend.question.domain.entity.AnswerAccusation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswerAccusationRepository extends JpaRepository<AnswerAccusation, Long> {

    List<AnswerAccusation> findAllByIsActiveTrue();
}
