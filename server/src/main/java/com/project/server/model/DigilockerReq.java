package com.project.server.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DigilockerReq {
    public String id;
    public String status;
    public String url;
    public String validUpto;
    public String traceId;

    @Override
    public String toString() {
        return "DigilockerReq{" +
                "id='" + id + '\'' +
                ", status='" + status + '\'' +
                ", url='" + url + '\'' +
                ", validUpto='" + validUpto + '\'' +
                ", traceId='" + traceId + '\'' +
                '}';
    }
}
