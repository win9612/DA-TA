package com.da_ta.backend.letter.controller.dto;

import com.da_ta.backend.letter.controller.dto.common.LetterInfo;
import com.da_ta.backend.letter.controller.dto.common.ReplyInfo;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FindReplyDetailResponse {

    private LetterInfo myLetterInfo;
    private String replyWriterId;
    private String replyWriterNickname;
    private ReplyInfo replyInfo;
}
