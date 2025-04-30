package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import edu.ucsb.cs156.example.entities.UCSBMenuItemReview;
import edu.ucsb.cs156.example.repositories.UCSBMenuItemReviewRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDateTime;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBMenuItemReviewIT {

    @Autowired
    public CurrentUserService currentUserService;

    @Autowired
    public GrantedAuthoritiesService grantedAuthoritiesService;

    @Autowired
    public UCSBMenuItemReviewRepository ucsbMenuItemReviewRepository;

    @Autowired
    public MockMvc mockMvc;

    @Autowired
    public ObjectMapper mapper;

    @MockBean
    UserRepository userRepository;

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
        // arrange
        UCSBMenuItemReview review = UCSBMenuItemReview.builder()
                .itemId(42L)
                .reviewerEmail("user@example.com")
                .stars(5)
                .comments("Excellent!")
                .build();

        ucsbMenuItemReviewRepository.save(review);

        // act
        MvcResult response = mockMvc.perform(get("/api/ucsbmenuitemreview?id=1"))
                .andExpect(status().isOk())
                .andReturn();

        // assert
        String expectedJson = mapper.writeValueAsString(review);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_review() throws Exception {
        String dateReviewed = "2023-04-27T14:30:00";

        MvcResult response = mockMvc.perform(
            post("/api/ucsbmenuitemreview/post")
                .param("itemId", "42")
                .param("reviewerEmail", "admin@example.com")
                .param("stars", "5")
                .param("dateReviewed", dateReviewed)
                .param("comments", "Amazing menu item!")
                .with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

        String responseString = response.getResponse().getContentAsString();

        UCSBMenuItemReview actual = mapper.readValue(responseString, UCSBMenuItemReview.class);

        assertEquals(42L, actual.getItemId());
        assertEquals("admin@example.com", actual.getReviewerEmail());
        assertEquals(5, actual.getStars());
        assertEquals(LocalDateTime.parse(dateReviewed), actual.getDateReviewed());
        assertEquals("Amazing menu item!", actual.getComments());
    }

}
