package com.project.management.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

/**
 * Chat de comunicação associado a um projeto específico.
 * Permite comunicação em tempo real entre membros do projeto.
 */
@Entity
@Getter
@Setter
@RequiredArgsConstructor
@ToString(exclude = {"project", "messages", "users"})
public class Chat {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String name;

  /**
   * Projeto ao qual este chat está vinculado.
   */
  @JsonIgnore
  @OneToOne
  private Project project;

  /**
   * Histórico de mensagens do chat.
   * Configurado para remoção em cascata quando o chat for excluído.
   */
  @JsonIgnore
  @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Message> messages = new ArrayList<>();

  /**
   * Usuários participantes do chat.
   */
  @ManyToMany
  private List<User> users = new ArrayList<>();
}