package com.project.management.models.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

/**
 * Convite para participação em um projeto.
 */
@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Invitation {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String token;

  private String email;

  private Long projectId;
}