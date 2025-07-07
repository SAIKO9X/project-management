package com.project.management.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.management.models.enums.IssuePriority;
import com.project.management.models.enums.IssueStatus;
import com.project.management.models.enums.IssueType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Issue associada a um projeto, representando tarefas ou problemas.
 */
@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Issue {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  /**
   * Projeto ao qual esta issue pertence.
   */
  @JsonIgnore
  @ManyToOne
  @ToString.Exclude
  private Project project;

  /**
   * Usuário que será o responsável pela tarefa.
   */
  @ManyToOne
  private User assignee;

  /**
   * Usuário que criou a issue.
   */
  @ManyToOne
  private User creator;

  /**
   * Comentários associados à issue, com remoção em cascata.
   */
  @JsonIgnore
  @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL, orphanRemoval = true)
  @ToString.Exclude
  private List<Comment> comments = new ArrayList<>();

  /**
   * Tags associadas à issue.
   */
  @ManyToMany
  @JoinTable(name = "issue_tag", joinColumns = @JoinColumn(name = "issue_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
  private List<Tag> tags = new ArrayList<>();

  /**
   * Marco/Sprint ao qual esta issue está vinculada.
   */
  @ManyToOne
  @ToString.Exclude
  private Milestone milestone;

  /**
   * Anexos associados à issue, com remoção em cascata.
   */
  @JsonIgnore
  @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL, orphanRemoval = true)
  @ToString.Exclude
  private List<Attachment> attachments = new ArrayList<>();

  @NotBlank(message = "O título é obrigatório")
  private String title;

  private String description;

  /**
   * Status da issue, armazenado como string.
   */
  @Enumerated(EnumType.STRING)
  @NotNull(message = "O status é obrigatório")
  private IssueStatus status;

  @NotNull(message = "O ID do projeto é obrigatório")
  private Long projectID;

  /**
   * Prioridade da issue, armazenada como string.
   */
  @Enumerated(EnumType.STRING)
  @NotNull(message = "A prioridade é obrigatória")
  private IssuePriority priority;

  /**
   * Tipo da issue, armazenado como string.
   */
  @Enumerated(EnumType.STRING)
  @NotNull(message = "O tipo da issue é obrigatório")
  private IssueType type;

  @Column(name = "due_date")
  private LocalDateTime dueDate;

  @JsonIgnore
  private LocalDateTime createdAt;

  @JsonIgnore
  private LocalDateTime updatedAt;

  /**
   * Inicializa automaticamente as datas de criação e atualização na persistência.
   */
  @PrePersist
  protected void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  /**
   * Atualiza automaticamente a data de modificação antes da atualização.
   */
  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}