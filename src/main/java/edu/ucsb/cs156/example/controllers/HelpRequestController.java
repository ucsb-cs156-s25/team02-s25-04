package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.HelpRequest;
import edu.ucsb.cs156.example.entities.UCSBDate;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.HelpRequestRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;

/**
 * This is a REST controller for HelpRequest
 */
@Tag(name = "HelpRequest")
@RequestMapping("/api/HelpRequest")
@RestController
@Slf4j
public class HelpRequestController extends ApiController {

    @Autowired
    HelpRequestRepository helpRequestRepository;

    /**
     * List all HelpRequests
     * 
     * @return an iterable of HelpRequests
     */
    @Operation(summary = "List all Help Requests")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<HelpRequest> allHelpRequests() {
        Iterable<HelpRequest> helpRequests = helpRequestRepository.findAll();
        return helpRequests;
    }

    /**
     * Create a new HelpRequest
     * 
     * @param requesterEmail      Email of the requester
     * @param teamId              Team ID
     * @param tableOrBreakoutRoom Table or breakout room
     * @param requestTime         Time of the request
     * @param explanation         Explanation of the request
     * @param solved              Whether the request is solved
     * @return the saved HelpRequest
     */
    @Operation(summary = "Create a new help request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public HelpRequest postHelpRequest(
            @Parameter(name = "requesterEmail") @RequestParam String requesterEmail,
            @Parameter(name = "teamId") @RequestParam String teamId,
            @Parameter(name = "tableOrBreakoutRoom") @RequestParam String tableOrBreakoutRoom,
            @Parameter(name = "requestTime") @RequestParam("requestTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime requestTime,
            @Parameter(name = "explanation") @RequestParam String explanation,
            @Parameter(name = "solved") @RequestParam boolean solved)
            throws JsonProcessingException {

        // For an explanation of @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        // See: https://www.baeldung.com/spring-date-parameters

        log.info("requestTime={}", requestTime);

        HelpRequest helpRequest = new HelpRequest();
        helpRequest.setRequesterEmail(requesterEmail);
        helpRequest.setTeamId(teamId);
        helpRequest.setTableOrBreakoutRoom(tableOrBreakoutRoom);
        helpRequest.setRequestTime(requestTime);
        helpRequest.setExplanation(explanation);
        helpRequest.setSolved(solved);

        HelpRequest savedHelpRequest = helpRequestRepository.save(helpRequest);
        return savedHelpRequest;
    }

    /**
     * Get a single help request by id
     * 
     * @param id the id of the help request
     * @return a help request
     */
    @Operation(summary = "Get a single help request")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public HelpRequest getById(
            @Parameter(name = "id") @RequestParam Long id) {
        HelpRequest helpRequest = helpRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(HelpRequest.class, id));

        return helpRequest;
    }

    /**
     * Update a single Help Request
     * 
     * @param id       id of the Help Request to update
     * @param incoming the new Help Request
     * @return the updated HelpRequest object
     */
    @Operation(summary = "Update a single Help Request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public HelpRequest updateHelpRequest(
            @Parameter(name = "id") @RequestParam Long id,
            @RequestBody @Valid HelpRequest incoming) {

        HelpRequest helpRequest = helpRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(HelpRequest.class, id));

        helpRequest.setRequesterEmail(incoming.getRequesterEmail());
        helpRequest.setTeamId(incoming.getTeamId());
        helpRequest.setTableOrBreakoutRoom(incoming.getTableOrBreakoutRoom());
        helpRequest.setRequestTime(incoming.getRequestTime());
        helpRequest.setExplanation(incoming.getExplanation());
        helpRequest.setSolved(incoming.getSolved());
        helpRequestRepository.save(helpRequest);

        return helpRequest;
    }

    /**
     * Delete a HelpRequest
     * 
     * @param id the id of the date to delete
     * @return a message indicating the date was deleted
     */
    @Operation(summary = "Delete a help request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteHelpRequest(
            @Parameter(name = "id") @RequestParam Long id) {
        HelpRequest helpRequest = helpRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(HelpRequest.class, id));

        helpRequestRepository.delete(helpRequest);
        return genericMessage("HelpRequest with id %s deleted".formatted(id));
    }

}
