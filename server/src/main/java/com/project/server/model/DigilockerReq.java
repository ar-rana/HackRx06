package com.project.server.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DigilockerReq {
    public String id;
    public String status;
    public String url;
    public String validUpto;
    public String traceId;
}
