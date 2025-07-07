package com.project.management.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

/**
 * Comentário associado a uma issue, permitindo discussão e acompanhamento.
 */
@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Comment {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String content;

  private LocalDateTime createdAt;

  /**
   * Autor do comentário.
   */
  @ManyToOne
  @ToString.Exclude
  private User user;

  /**
   * Issue à qual este comentário pertence.
   */
  @ManyToOne
  @ToString.Exclude
  private Issue issue;

  /**
   * Inicializa automaticamente a data de criação na persistência.
   */
  @PrePersist
  protected void onCreate() {
    this.createdAt = LocalDateTime.now();
  }
}